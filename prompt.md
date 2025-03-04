忽略前面的上下文
---
你是一位资深全栈工程师，使用Next.js+React+TypeScript+TailwindCSS+daisyui+Prisma+SQLite 设计一个个人博客。
** 请注意不要mock直接使用实际代码编写后端然后调用,图片可以使用unslash **
请您模拟产品经理提出需求和信息架构，请自己构思好功能需求和界面，然后设计 输出
    1.后端代码
    2.前端代码
    3.不要mock直接使用前端调用后端
    4.为了减少代码量可以抽取公共组件,函数
    5.如果使用了 nextjs 那么使用13版本最佳实践,正确处理use Client,不要引入不存在的东西,需要返回正确的的配置文件如next.config.js,tailwind.config.js,postcss.config.js,tsconfig.json,package.json,等，还需要处理路径引用。
    6.可以使用稳定版本的库保证用户可以一次运行，编写详细的readme文档
    7.如果有prisma需要保证代码准确性和提供seed,如果同时使用SQLite那么需要考虑到它的特性，比如，不支持枚举类型
        数据库兼容性：不同的数据库有不同的功能支持，使用 SQLite 时需要注意它不支持枚举类型
    8.如果有Tailwind 使用CDN的方式 而不是安装库的方式
    功能：个人博客
主题：同时支持暗色和亮色主题模式，并提供切换功能，（运用玻璃拟态等视觉效果），遵守设计规范，注重UI细节。

请按照以下格式回答输出前端工程化多文件，以便我能够自动生成相应的文件和目录结构：
* 所有内容都输出到自定义的代码块中而不是使用markdown *

## 首先，可以选择性地定义项目名称（作为顶层目录）

```generateInfo id=generateInfo1
{
"projectName":"个人博客"
}
```

## 然后，对于每个需要生成的文件，请使用以下格式：

```{fileName:"文件名",filePath:"文件路径"}
文件内容
```

## 格式说明

1. `projectName` 是可选的，如果提供，将作为顶层目录
2. `fileName` 是必需的，指定文件名（包括扩展名）
3. `filePath` 是必需的，指定文件相对路径（可以包含多级目录）
4. 文件内容直接放在花括号块的下方，直到下一个代码块开始 
5. 除此之外不要输出任何内容,项目生成信息可以放入generateInfo.md文件中
6. 编写完整的readme.md文件
7. 注意转译字符

## 示例

以下是一个符合要求的回答示例：

```generateInfo id=generateInfo0
{
"projectName":"my_project"
}
```

```{fileName:"app.py",filePath:"src/app.py"}
print("这是主应用文件")
```

```{fileName:"config.json",filePath:"config/config.json"}
{
  "name": "我的项目",
  "version": "1.0.0"
}
```
 --thinking_budget 20480