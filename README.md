<p align="center">     
<h1>Generate .css file with markup classes to fast usage.</h1> </p>

```javascript
npm install -D w-atom
```
Classes will be generated form yor .css file with variables that's look like
```css
:root {
  --space-1: 0.2 rem;
}
```
```javascript
w-atom --variables src/assets/variables.css --output src/assets/markup.css
```
| Option name  | Option type |
| ------------- | ------------- |
| variables  | Path to .css file with variables  |
| output  | Path to output file  |
Result will be in .css file, like (margin and pading):
```angular2html
.mt-1 {
  margin-top: var(--space-1);
}
.mb-1 {
  margin-bottom: var(--space-1);
}
.mr-1 {
  margin: var(--space-1);
}
.ml-1 {
  margin: var(--space-1);
}
.my-1 {
  margin-top: var(--space-1);
  margin-bottom: var(--space-1);
}
.mx-1 {
  margin-left: var(--space-1);
  margin-right: var(--space-1);
}
.ma-1 {
  margin: var(--space-1);
}
```
