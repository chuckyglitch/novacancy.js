# novacancy.js

novacancy.js is a text neon golden effect jQuery plugin.

## Demo

<a href='http://chuckyglitch.github.io/novacancy.js/'>Visit demo site</a>

## Basic Usage

### Just use
```javascript
$('#no').novacancy();
```

### or detail
```javascript
$('#no').novacancy({
	'reblinkProbability': 0.1,
	'blinkMin': 0.2,
	'blinkMax': 0.6,
	'loopMin': 8,
	'loopMax': 10,
	'color': '#ffffff',
	'glow': ['0 0 80px #ffffff', '0 0 30px #008000', '0 0 6px #0000ff'],
	'off': 1,
	'blink': 1,
	'classOn': 'on',
	'classOff': 'off',
	'autoOn': true
});
```

## Parameters

- <b>reblinkProbability</b >: probability of reblink(0 to 1), <b>Number</b>, <b>optional</b>, default: <b>(1/3)</b>
- <b>blinkMin</b>: time(sec.) of minimum blink, <b>Number</b>, <b>optional</b>, default: <b>0.01</b>
- <b>blinkMax</b>: time(sec.) of maximum blink, <b>Number</b>, <b>optional</b>, default: <b>0.5</b>
- <b>loopMin</b>: time(sec.) of minimum trigger blink, <b>Number</b>, <b>optional</b>, default: <b>0.5</b>
- <b>loopMax</b>: time(sec.) of maximum trigger blink, <b>Number</b>, <b>optional</b>, default: <b>2</b>
- <b>color</b>: colors, <b>String</b>, <b>optional</b> default: <b>'ORANGE'</b>. set <b>null</b> to disable.
- <b>glow</b>: array of text-shadow colors, <b>Array</b>, <b>optional</b>, default: <b>['0 0 80px Orange', '0 0 30px Red', '0 0 6px Yellow']</b>. set <b>null</b> to disable.
- <b>off</b>: amount of off chars, <b>Number</b>, <b>optional</b>, default: <b>0</b>
- <b>blink</b>: amount of blink chars, <b>Number</b>, <b>optional</b>, default: <b>0</b>, <b>(0 means all chars)</b>
- <b>classOn</b>: class name of on chars, <b>String</b>, <b>optional</b> default: <b>'on'</b>
- <b>classOff</b>: class name of off chars, <b>String</b>, <b>optional</b> default: <b>'off'</b>
- <b>autoOn</b>: blink on at start, <b>Boolean</b>, <b>optional</b>, default: <b>true</b>

### colors example:
```javascript
Hexadecimal: '#ffffff'
RGB: 'rgb(255,255,255)'
RGBA: 'rgba(255,255,255,1)'
Text: 'WHITE'
```

## Control

### trigger blink on
```javascript
$('#no').trigger('blinkOn');
```
### trigger blink off
```javascript
$('#no').trigger('blinkOff');
```

## Special Thanks

- Evil Reiko <evilreiko@hotmail.com>

