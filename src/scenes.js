import knots from './knotmatrix'

let [width, height, cols, rows, elementLength] = [560, 380, 28, 19, 9];

export function setDimensions(widthin, heightin, rowsin, colsin, elementLengthin) {
    width = widthin;
    height = heightin;
    rows = rowsin;
    cols = colsin;
    elementLength = elementLengthin;
}

export async function rotatingImage(ctx, img, hue, saturation, speed) {

    let frame = 0;
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    const update = state => {
        ctx.filter = `saturate(${state.saturation/255}) hue-rotate(${state.hue/255*360}deg)`;
        ctx.resetTransform();
        ctx.translate((width / 2), (height / 2))
        ctx.rotate(frame * Math.PI / 180);
        ctx.translate(-(width / 2), -(height / 2))
        ctx.drawImage(img, -width * 0.2, -height * 0.2, width * 1.4, height * 1.4)

        frame++;
    }
    const promise = new Promise(resolve => {
        debugger
        if (img.loadeded) {
            ctx.drawImage(img, -width * 0.2, -height * 0.2, width * 1.4, height * 1.4)
            resolve(update);
        } else {
            img.onload = () => {
                ctx.drawImage(img, -width * 0.2, -height * 0.2, width * 1.4, height * 1.4)
                resolve(update);
            }
        }
    });
    return promise;
}

export async function movingblock(ctx, count, distance, hue, color, delay, hueoffset) {

    const fps = 60;

    let frame = 0;
    ctx.fillStyle = '#000'

    console.log(LightenDarkenColor('#f0f', -1))
    ctx.fillRect(0, 0, width, height)
    const dColors = Array.from({
        length: delay
    }).map((e, i) => LightenDarkenColor(color, delay && -i * 255 / delay))
    const promise = new Promise(resolve => {
        const update = state => {
            fillBackground(ctx, '#000');
            ctx.filter = `saturate(${state.saturation/255}) hue-rotate(${hue+(state.hue/16*frame)}deg)`;
            drawhorizontalmovingblockframe(delay, count, frame, distance, fps, ctx, state, dColors, hueoffset);


            frame++;
        }
        resolve(update);

    });
    return promise;
}


export async function movingblockvertical(ctx, count, distance, hue, color, delay, hueoffset) {

    const fps = 60;

    let frame = 0;
    ctx.fillStyle = '#000'

    console.log(LightenDarkenColor('#f0f', -1))
    ctx.fillRect(0, 0, width, height)
    const dColors = Array.from({
        length: delay
    }).map((e, i) => LightenDarkenColor(color, delay && -i * 255 / delay))
    const promise = new Promise(resolve => {
        const update = state => {
            fillBackground(ctx, '#000');
            ctx.filter = `saturate(${state.saturation/255}) hue-rotate(${hue+(state.hue/16*frame)}deg)`;
            drawVerticalmovingBlockFrame(delay, count, frame, distance, fps, ctx, state, dColors, hueoffset);


            frame++;
        }
        resolve(update);

    });
    return promise;
}

export async function movingblockcross(ctx, count, distance, hue, color, delay, hueoffset) {

    const fps = 60;

    let frame = 0;
    ctx.fillStyle = '#000'

    console.log(LightenDarkenColor('#f0f', -1))
    ctx.fillRect(0, 0, width, height)
    const promise = new Promise(resolve => {
        const update = state => {
            const dColors = Array.from({
                length: state.v3
            }).map((e, i) => LightenDarkenColor(color, state.v3 && -i * 255 / state.v3))
            fillBackground(ctx, '#000');
            ctx.filter = `saturate(${state.saturation/255}) hue-rotate(${hue+(state.hue/16*frame)}deg)`;
            drawVerticalmovingBlockFrame(state.v3, state.v1, frame, state.v2, fps, ctx, state, dColors, hueoffset);
            drawhorizontalmovingblockframe(Math.floor(state.v3 * 0.66), Math.floor(state.v1 * 0.7), frame, state.v2, fps, ctx, state, dColors, hueoffset);


            frame++;
        }
        resolve(update);

    });
    return promise;
}

export async function blocks(ctx, count, distance, hue, color, delay, hueoffset) {

    const fps = 60;

    let frame = 0;
    ctx.fillStyle = '#000'

    console.log(LightenDarkenColor('#f0f', -1))
    ctx.fillRect(0, 0, width, height)
    const dColors = Array.from({
        length: delay
    }).map((e, i) => LightenDarkenColor(color, delay && -i * 255 / delay))
    const promise = new Promise(resolve => {
        const update = state => {
            fillBackground(ctx, '#000');
            ctx.filter = `saturate(${state.saturation/255}) hue-rotate(${hue+(state.hue/16*frame)}deg)`;
            const square = [Math.floor(frame * (state.speed / 1024) + 4) % 3, Math.floor(frame * (state.speed / 1024) / 3 + 4) % 2]
            fillSquare(ctx, square[0], square[1], '#ffff00');
            fillSquare(ctx, (square[0] + 1) % 3, (square[1] + 1) % 2, '#ffff00');
            // fillSquare(ctx, (square[0] + 2) % 3, (square[1] + 2) % 2, '#ffff00');

            frame++;
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
                fillPixel(ctx, (((frame * state.speed / 64 + i * distance)) % fps - d) / (fps / 3), Math.floor(((frame * state.speed / 64 + i * distance) - d) / fps) % 3, changeHue(dColors[d], hueOffset * i));
        }
        d--;
    }
}

function drawVerticalmovingBlockFrame(delay, count, frame, distance, fps, ctx, state, dColors, hueOffset) {
    let d = delay - 1;
    while (d >= 0) {
        for (let i = 0; i < count; i++) {
            if ((frame + i * distance) % fps <= frame + i * distance)
                fillPixel(ctx, (Math.floor(((frame * state.speed / 64 + i * distance) - d) / fps) % 4), ((frame * state.speed / 64 + i * distance) % fps - d) / (fps / 4), changeHue(dColors[d], hueOffset * i));
        }
        d--;
    }
}

async function delay(time = 0) {
    await new Promise(resolve => setTimeout(resolve, time))
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



function rotateImage(ctx, width, height, img, frame) {

    ctx.resetTransform();
    ctx.translate(width / 2, height / 2)
    ctx.rotate(frame * Math.PI / 180);
    ctx.translate(-width / 2, -height / 2)

    ctx.drawImage(img, 0, 0);
}


function fillPixel(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * width / cols * elementLength, y * height / rows * elementLength, width / cols, height / rows);
}

function fillBar(ctx, x, y, horizontal, color, length = 1) {
    ctx.fillStyle = color;

    ctx.fillRect(
        x * width / cols * elementLength,
        y * height / rows * elementLength,
        width / cols * length * (horizontal ? elementLength : 1),
        height / rows * length * (horizontal ? 1 : elementLength)
    );
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