# css

## 选择器

1. id 选择器(#myid)
2. 类选择器(.myclass)
3. 属性选择器(a[rel="external"])
4. 伪类选择器(a:hover, li:nth-child)
5. 标签选择器(div, h1,p)
6. 相邻选择器（h1 + p）
7. 子选择器(ul > li)
8. 后代选择器(li a)
9. 通配符选择器(\*)

### 优先级：

!important> 内联样式（1000）> ID 选择器（0100）>类选择器/属性选择器/伪类选择器
（0010）元素选择器/伪元素选择器（0001）> 通配符选择器（0000）

## 小技巧

### 绝对居中

1. 利用 margin

```css
margin: auto;
```

2. 使用 transform

```css
transform: translate(50%, 50%);
```

3. 使用 flex

```css
display: flex;
align-items: center;
justify-content: center;
```

### float

float 脱离正常文档流当时仍然占据文档流文本空间。使用 float 的元素会自动加入一个
块级框，可以设置宽和高。 float 会使父元素高度计算忽略

1. 利用 clear 清理

```css
clear: both;
```

2. 利用 bfc 清理
