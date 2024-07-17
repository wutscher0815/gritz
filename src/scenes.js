import knots from './knotmatrix'

let [width, height, cols, rows, elementLength] = [280, 190, 28, 19, 9];

export function setDimensions(widthin, heightin, rowsin, colsin, elementLengthin) {
    width = widthin;
    height = heightin;
    rows = rowsin;
    cols = colsin;
    elementLength = elementLengthin;
}

export async function rotatingImage(ctx, img, filename) {
    img.src = filename

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    const update = (state, frame) => {
        ctx.filter = `saturate(${state.saturation / 255}) hue-rotate(${state.hue / 255 * 360}deg)`;
        ctx.resetTransform();
        ctx.translate((width / 2), (height / 2))
        ctx.rotate(frame * Math.PI / 180 * state.speed / 96);
        ctx.translate(-(width / 2), -(height / 2))
        ctx.drawImage(img, -width * 0.25, -height * 0.25, width * 1.5, height * 1.5)

    }
    const promise = new Promise(resolve => {
        if (img.loadeded) {
            ctx.drawImage(img, -width * 0.25, -height * 0.25, width * 1.5, height * 1.5)
            resolve(update);
        } else {
            img.onload = () => {
                ctx.drawImage(img, -width * 0.25, -height * 0.25, width * 1.5, height * 1.5)
                resolve(update);
            }
        }
    });
    return promise;
}

export async function pulsateBackground(ctx, color, showFrame) {


    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    const promise = new Promise(resolve => {
        const update = (state, frame) => {

            const brightness = 1 - ((state.v1 / 30 + (1 + Math.sin(frame * state.speed / 128 / 60 * 2 * Math.PI)) / 2) * (1 - state.v1 / 30))
            ctx.filter = `saturate(${state.saturation / 255}) hue-rotate(${state.hue / 16 * frame}deg) brightness(${brightness})`;
            fillBackground(ctx, color)
            if (showFrame) {
                ctx.fillStyle = '#000'
                ctx.fillRect(width / cols, height / rows, width - 2 * width / cols, height - 2 * height / rows,)
            }
        }
        resolve(update)
    });
    return promise;
}


export async function blinkBackground(ctx, color, showFrame) {


    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    const promise = new Promise(resolve => {
        const update = (state, frame) => {
            const mod = (frame * state.speed / 128) % (state.v1 * 5 + state.v2 * 5)
            ctx.filter = `saturate(${state.saturation / 255}) hue-rotate(${(state.hue / 16 * frame)}deg)`;
            fillBackground(ctx, mod > state.v1 * 5 ? '#000' : color)
            if (showFrame) {
                ctx.fillStyle = '#000'
                ctx.fillRect(width / cols, height / rows, width - 2 * width / cols, height - 2 * height / rows,)
            }
        }
        resolve(update)
    });
    return promise;
}

export async function movingblock(ctx, color, hueoffset) {

    const fps = 60;


    ctx.fillStyle = '#000'

    console.log(LightenDarkenColor('#f0f', -1))
    ctx.fillRect(0, 0, width, height)
    const promise = new Promise(resolve => {
        const update = (state, frame) => {
            const dColors = Array.from({
                length: state.v3
            }).map((e, i) => LightenDarkenColor(color, state.v3 && -i * 255 / state.v3))
            fillBackground(ctx, '#000');
            ctx.filter = `saturate(${state.saturation / 255}) hue-rotate(${(state.hue / 16 * frame)}deg)`;
            drawhorizontalmovingblockframe(state.v3, state.v1, frame, state.v2, fps, ctx, state, dColors, hueoffset);

        }
        resolve(update);

    });
    return promise;
}


export async function movingblockvertical(ctx, color, hueoffset) {

    const fps = 60;


    ctx.fillStyle = '#000'

    console.log(LightenDarkenColor('#f0f', -1))
    ctx.fillRect(0, 0, width, height)
    const promise = new Promise(resolve => {
        const update = (state, frame) => {
            const dColors = Array.from({
                length: state.v3
            }).map((e, i) => LightenDarkenColor(color, state.v3 && -i * 255 / state.v3))
            fillBackground(ctx, '#000');
            ctx.filter = `saturate(${state.saturation / 255}) hue-rotate(${(state.hue / 16 * frame)}deg)`;
            drawVerticalmovingBlockFrame(state.v3, state.v1, frame, state.v2, fps, ctx, state, dColors, hueoffset);


        }
        resolve(update);

    });
    return promise;
}
export async function movingstripevertical(ctx, color, hueoffset) {



    ctx.fillStyle = '#000'

    ctx.fillRect(0, 0, width, height)
    const promise = new Promise(resolve => {
        const update = (state, frame) => {
            ctx.fillStyle = color;
            drawVerticalmovingStripeFrame(state.v3, state.v2 / 30, frame, ctx, state, color, hueoffset);


        }
        resolve(update);

    });
    return promise;
}

export async function movingstripehorizontal(ctx, color, hueoffset) {



    ctx.fillStyle = '#000'

    ctx.fillRect(0, 0, width, height)
    const promise = new Promise(resolve => {
        const update = (state, frame) => {
            ctx.fillStyle = color;
            drawhorizontalmovingStripeFrame(state.v3, state.v2 / 30, frame, ctx, state, color, hueoffset);


        }
        resolve(update);

    });
    return promise;
}

export async function movingblockcross(ctx, color, hueoffset) {

    const fps = 60;

    ctx.fillStyle = '#000'

    console.log(LightenDarkenColor('#f0f', -1))
    ctx.fillRect(0, 0, width, height)
    const promise = new Promise(resolve => {
        const update = (state, frame) => {

            const dColors = Array.from({
                length: state.v3
            }).map((e, i) => LightenDarkenColor(color, state.v3 && -i * 255 / state.v3))
            fillBackground(ctx, '#000');
            ctx.filter = `saturate(${state.saturation / 255}) hue-rotate(${(state.hue / 16 * frame)}deg)`;
            drawVerticalmovingBlockFrame(state.v3, state.v1, frame, state.v2, fps, ctx, state, dColors, hueoffset);
            drawhorizontalmovingblockframe(Math.floor(state.v3 * 0.66), Math.floor(state.v1 * 0.7), frame, state.v2, fps, ctx, state, dColors, hueoffset);


        }
        resolve(update);

    });
    return promise;
}

export async function blocks(ctx, hue, color) {

    ctx.fillStyle = '#000000'

    console.log(LightenDarkenColor('#ff00ff', -1))
    ctx.fillRect(0, 0, width, height)

    const promise = new Promise(resolve => {
        const update = (state, frame) => {

            fillBackground(ctx, '#000000');
            ctx.filter = `saturate(${state.saturation / 255}) hue-rotate(${hue + (state.hue / 16 * frame)}deg)`;
            const square = [Math.floor(frame * (state.speed / 1024) + 4) % 3, Math.floor(frame * (state.speed / 1024) / 3 + 4) % 2]

            let i = state.v1;
            while (i--) {
                fillSquare(ctx, (square[0] + i) % 3, (square[1] + i) % 2, color);
            }
        }
        resolve(update);

    });
    return promise;
}



function drawhorizontalmovingblockframe(delay, count, frame, distance, fps, ctx, state, dColors, hueOffset) {
    let d = delay - 1;
    while (d >= 0) {
        for (let i = 0; i < count; i++) {
            if ((frame + i * distance) % fps <= frame + i * distance)
                fillPixel(ctx, (((frame * state.speed / 128 + i * distance)) % fps - d) / (fps / 3), Math.floor(((frame * state.speed / 128 + i * distance) - d) / fps) % 3, changeHue(dColors[d], hueOffset * i));
        }
        d--;
    }
}

function drawVerticalmovingBlockFrame(delay, count, frame, distance, fps, ctx, state, dColors, hueOffset) {
    let d = delay - 1;
    while (d >= 0) {
        for (let i = 0; i < count; i++) {
            if ((frame + i * distance) % fps <= frame + i * distance)
                fillPixel(ctx, (Math.floor(((frame * state.speed / 128 + i * distance) - d) / fps) % 4), ((frame * state.speed / 128 + i * distance) % fps - d) / (fps / 4), changeHue(dColors[d], hueOffset * i));
        }
        d--;
    }
}

function drawVerticalmovingStripeFrame(count, widthRelative, frame, ctx, state, color, hueOffset) {

    fillBackground(ctx, '#000');

    const stripeWidth = width / count * widthRelative;


    for (let i = -1; i < count + 1; i++) {
        ctx.fillStyle = color;
        ctx.filter = `saturate(${state.saturation / 255}) hue-rotate(${(state.hue * (state.v3 > 1 ? (state.v3 * frame / 64) : 1))}deg)`;

        ctx.fillRect(i * width / count + ((frame * state.speed / 64) % 60) / 60 * width / count, 0, stripeWidth, height);
    }
}

function drawhorizontalmovingStripeFrame(count, heightRelative, frame, ctx, state, color, hueOffset) {

    fillBackground(ctx, '#000');

    const stripeheight = height / count * heightRelative;


    for (let i = -1; i < count + 1; i++) {
        ctx.fillStyle = color;
        ctx.filter = `saturate(${state.saturation / 255}) hue-rotate(${(state.hue * (state.v1 > 1 ? (state.v1 * (frame % 60) / 64) : 1))}deg)`;

        ctx.fillRect(0, i * height / count + (frame * state.speed / 64) % 60 / 60 * height / count, width, stripeheight);
    }
}



function fillSquare(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * width / cols * elementLength, y * height / rows * elementLength, width / cols * (elementLength + 1), height / rows * (elementLength + 1));
}





function LightenDarkenColor(col, amt) {
    var usePound = true;
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}





function fillPixel(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * width / cols * elementLength, y * height / rows * elementLength, width / cols, height / rows);
}


function fillBackground(ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}
// Changes the RGB/HEX temporarily to a HSL - Value, modifies that value
// and changes it back to RGB/HEX.
function changeHue(rgb, degree) {
    var hsl = rgbToHSL(rgb);
    hsl.h += degree;
    if (hsl.h > 360) {
        hsl.h -= 360;
    } else if (hsl.h < 0) {
        hsl.h += 360;
    }
    return hslToRGB(hsl);
}

// exepcts a string and returns an object
function rgbToHSL(rgb) {
    // strip the leading # if it's there
    rgb = rgb.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (rgb.length === 3) {
        rgb = rgb.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(rgb.substr(0, 2), 16) / 255,
        g = parseInt(rgb.substr(2, 2), 16) / 255,
        b = parseInt(rgb.substr(4, 2), 16) / 255,
        cMax = Math.max(r, g, b),
        cMin = Math.min(r, g, b),
        delta = cMax - cMin,
        l = (cMax + cMin) / 2,
        h = 0,
        s = 0;

    if (delta === 0) {
        h = 0;
    } else if (cMax === r) {
        h = 60 * (((g - b) / delta) % 6);
    } else if (cMax === g) {
        h = 60 * (((b - r) / delta) + 2);
    } else {
        h = 60 * (((r - g) / delta) + 4);
    }

    if (delta === 0) {
        s = 0;
    } else {
        s = (delta / (1 - Math.abs(2 * l - 1)))
    }

    return {
        h: h,
        s: s,
        l: l
    }
}

// expects an object and returns a string
function hslToRGB(hsl) {
    var h = hsl.h,
        s = hsl.s,
        l = hsl.l,
        c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r, g, b;

    if (h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    r = normalize_rgb_value(r, m);
    g = normalize_rgb_value(g, m);
    b = normalize_rgb_value(b, m);

    return rgbToHex(r, g, b);
}

function normalize_rgb_value(color, m) {
    color = Math.floor((color + m) * 255);
    if (color < 0) {
        color = 0;
    }
    return color;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}