export const C = 1.0

export const EPS = 0.00001;

export type vec4 = { x: number, y: number, z: number, t: number }
export type vec3 = { x: number, y: number, z: number }


export const dot = (x: vec3, y: vec3) => x.x * y.x + x.y * y.y + x.z * y.z

export const euclidean = (x: vec3, y: vec3) => Math.sqrt(dot(x, y))

export const bilinear = (x: vec4, y: vec4) => dot(x, y) - (C ** 2) * x.t * y.t

export const enum Like {
    Time, Null, Space
}

export const kind = (x: vec4) => {
    const speed = bilinear(x, x)
    if (Math.abs(speed) < EPS) return Like.Null
    else if (speed < 0) return Like.Time
    else return Like.Space
}

export const causal = (x: vec4) => kind(x) != Like.Space

export const enum Direction {
    Future, Zero, Past
}

export const direction = ({ t }: vec4) => Math.abs(t) < EPS 
                                          ? Direction.Zero 
                                          : t < 0 
                                            ? Direction.Past : Direction.Future;


export const sub = (x: vec4, y: vec4): vec4 => ({ x: x.x - y.x, y: y.x - y.y, z: x.z - y.z, t: x.t - y.t })

export const preceeds = (p: vec4, q: vec4) => causal(sub(p, q)) && direction(sub(p, q)) != Direction.Past 

export const consistent = (p: vec4[]) => {
    for(let i = 0; i < p.length; i++) {
        for(let j = i; j < p.length; j++) {
            if(!preceeds(p[j], p[i])) return false;
        }
    }
    return true;
}

export type cacuchysurface = (x: vec4) => number

export type worldline = (t: number) => vec4

export const intersect = (phi: cacuchysurface) => (q: worldline, t0: number, t1: number, n=16) => {
    for(let i = 0; i < n; i++) {
        const t = (t0 + t1) / 2
        if (t > phi(q(t))) { t1 = t }
        else { t0 = t }
    }
    return q(t0)
}

export const localPerceptionFilter = (me: vec4) => (other: vec4) => {
    const d = euclidean(me, other) / C
    return Math.min(other.t + d - 1, me.t)
}

export const minkwoski = t => (x: vec4) => {
    return t
}

export const optimistic = (other: vec4) => (me: vec4) => {
    return other.t
}