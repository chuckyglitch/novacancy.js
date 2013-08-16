# novacancy.js

novacancy.js is a text neon golden effect jQuery plugin.

## Demo

<a href='http://chuckyglitch.twbbs.org/novacancy/'>Visit demo site</a>

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
	'autoOn': true
});
```

## Parameters

- <b>reblinkProbability</b >: 0.1(0 to 1), optional, default: (1/3)
- <b>blinkMin</b>: 0.2(s), optional, default: 0.01
- <b>blinkMax</b>: 0.6(s), optional, default: 0.5
- <b>loopMin</b>: 8(s), optional, default: 0.5
- <b>loopMax</b>: 10(s), optional, default: 2
- <b>color</b>: colors, optional, default: 'ORANGE'
- <b>glow</b>: array of colors, optional, default: ['0 0 80px Orange', '0 0 30px Red', '0 0 6px Yellow']
- <b>off</b>: amount of off chars, optional, default: 0
- <b>blink</b>: amount of blink chars, optional, default: 0, 0 means all chars
- <b>autoOn</b>: blink on at start, optional, default: true

### colors example:
```javascript
Hexadecimal: '#ff0000'
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

Evil Reiko <evilreiko@hotmail.com>

