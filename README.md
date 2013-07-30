# novacancy.js

novacancy.js is a text neon golden effect jQuery plugin.

## Demo

<a href='http://chuckyglitch.twbbs.org/novacancy/'>Visit demo site</a>

## Basic Usage

```javascript
$('.no').novacancy({
	'reblinkProbability': 0.1,
	'blinkMin': 0.2,
	'blinkMax': 0.6,
	'loopMin': 8,
	'loopMax': 10,
	'color': 'WHITE',
	'blink': true
});
```

## Parameters

- <b>reblinkProbability</b >: 0.1(0 to 1), optional, default: (1/3)
- <b>blinkMin</b>: 0.2(s), optional, default: 0.01
- <b>blinkMax</b>: 0.6(s), optional, default: 0.5
- <b>loopMin</b>: 8(s), optional, default: 0.5
- <b>loopMax</b>: 10(s), optional, default: 2
- <b>color</b>: ['WHITE','RED','ORANGE'], optional, default: ORANGE
- <b>blink</b>: [true, false], optional, default: true

## Coming Soon

- custom color
- parameters validate
