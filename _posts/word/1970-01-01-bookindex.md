---
layout: blog
word: true
background-image: http://ot1cc1u9t.bkt.clouddn.com/17-7-16/91630214.jpg
category: 书籍
title: xxx
tags:
- 书籍
- word
- liberxue读过书
redirect_from:
  - /1970/01/bookindex/
---
> swagger 官方文档
: http://springfox.github.io/springfox/docs/current/

# 添加依赖

```
<properties>
	<swagger-version>2.9.0</swagger-version>
</properties>
...
<!-- swagger2核心依赖 -->
<dependency>
	<groupId>io.springfox</groupId>
	<artifactId>springfox-swagger2</artifactId>
	<version>${swagger-version}</version>
</dependency>
<!-- swagger2 ui页面 -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>${swagger-version}</version>
</dependency>
```
*  可以通过http://springfox.github.io/springfox/docs/current/#getting-started，查看当前最新版本

# 开启Swagger
修改springboot启动类，添加注解```@EnableSwagger2```
```
@EnableSwagger2
@SpringBootApplication
public class SpringbootDemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(SpringbootDemoApplication.class, args);
	}
}
```
# 配置Swagger
创建swagger配置类，比如```SwaggerConfigurer```
```
@Configuration
public class SwaggerConfigurer{
    @Bean
    public Docket RestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
            .groupName("rest")
            .apiInfo(apiInfo())
            .select()
            .apis(RequestHandlerSelectors.withMethodAnnotation(ApiOperation.class))
            .paths(PathSelectors.any())
            .build();
    }
    
    @Bean
    public Docket packageApi(){
        return new Docket(DocumentationType.SWAGGER_2)
            .groupName("package")
            .apiInfo(apiInfo())
            .select()
            .apis(RequestHandlerSelectors.basePackage("top.oyoung.springbootdemo.controller"))
            .paths(PathSelectors.any())
            .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
            .title("api文档")
            .description("restfun 风格接口")
            //服务条款网址
            .termsOfServiceUrl("http://blog.csdn.net/forezp")
            .version("1.0")
            //.contact(new Contact("帅呆了", "url", "email"))
            .build();
    }

}
```

```apiInfo()```方法用来定义项目的基本信息。

另外定义了两个bean，都是```Docket```类型，他们通过```groupName()```进行区分，通过不同的组名，可以定义多个```Docket```。在实现中，他们连个的区别在```api()```方法，第一个定义了扫描```ApiOperation``注解修饰的方法；而第二个扫面指定的包名。

> 详细可阅读http://springfox.github.io/springfox/docs/current/#quick-start-guides

# 使用Swagger注解
```
@Api("test")
@Controller
@Validated
@RequestMapping("/test")
public class TestController {

	@ApiOperation("index")
    @RequestMapping("")
    public ModelAndView index(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("index");
        modelAndView.addObject("param","young");
        modelAndView.addObject("params",new ArrayList<>());
        return modelAndView;
    }
    ...
}
```
然后启动springboot项目，访问
```
http://localhost:8080/swagger-ui.html
```
就可以看到ui界面了。

# 问题
## 1. Refused to execute script

现象：
```/swagger-ui.html``` 空白，前端控制台报错：
```
Refused to execute script from ‘XXXX’ because its MIME type (‘text/html’) is not executable, and strict MIME type checking is enabled.
```
原因：
	配置了Security，拦截了静态资源，可以修改Security配置类，放开静态资源，添加如下规则：
```

@Override
protected void configure(HttpSecurity http) throws Exception {
	...
    http.authorizeRequests()
            .antMatchers("/css/**", "/js/**","/images/**", "/webjars/**", "**/favicon.ico", "/index").permitAll();
    ...
}
```

### 2. Unable to infer base url
访问```/swagger-ui.html```，弹框提示：
```
Unable to infer base url.   
This is common when using dynamic servlet registration or when the API is behind an API Gateway.  
The base url is the root of where all the swagger resources are served. For e.g. if the api is available at   
http://example.org/api/v2/api-docs then the base url is http://example.org/api/.   
Please enter the location manually:  
```
原因：
开启了Security，对swagger的接口进行了拦截。
处理：

*  一种是访问swagger前，先登录应用，然后再请求```/swagger-ui.html```
*  另一种是将swagger接口都添加到security的忽略名单中，在Security的配置类中添加：
```
@Override
public void configure(WebSecurity web) throws Exception {
     web.ignoring()
         .antMatchers(
             "/swagger-ui.html",
             "/v2/api-docs",
             "/swagger-resources",
             "/swagger-resources/configuration/ui",
             "/swagger-resources/configuration/security"
             );
 }
```

人间的贵有三种，一种是一眼就能看出的贵，这通常是因为其吃穿用度写满了昂贵的标签，这是富贵；一种是第一眼看不出贵，但过后就能感受出来的身份地位、教养学识，这是权贵；还有一种是看多少眼都还是那样耀眼，只因为其迷人的气质和思想，这是高贵.人间的贵有三种，一种是一眼就能看出的贵，这通常是因为其吃穿用度写满了昂贵的标签，这是富贵；一种是第一眼看不出贵，但过后就能感受出来的身份地位、教养学识，这是权贵；还有一种是看多少眼都还是那样耀眼，只因为其迷人的气质和思想，这是高贵.人间的贵有三种，一种是一眼就能看出的贵，这通常是因为其吃穿用度写满了昂贵的标签，这是富贵；一种是第一眼看不出贵，但过后就能感受出来的身份地位、教养学识，这是权贵；还有一种是看多少眼都还是那样耀眼，只因为其迷人的气质和思想，这是高贵.

