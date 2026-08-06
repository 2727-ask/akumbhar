
class InstrumentCluster extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.basePath = this.getAttribute('base-path') || './assets';

        this.shadowRoot.innerHTML = `
            <style>
                ${this.getCss()}
            </style>
            ${this.getHtml()}
        `;

        this.initLogic();
    }

    getCss() {
        return `
        /* Reset and basic body setup */
        :host { 
            display: block; 
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            width: 100%;
        }

        /* Container for responsive scaling */
        .cluster-wrapper {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            container-type: inline-size;
        }

        /* Main cluster screen */
        .cluster {
            position: relative;
            width: 100%;
            aspect-ratio: 24 / 9;
            background: url('image_eead99.jpg') center center / cover no-repeat,
                linear-gradient(to bottom, #e4e7ec 0%, #ffffff 100%);
            border-radius: 2cqw;
            overflow: hidden;
            color: #333;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        /* --- Gauges General --- */
        .gauge {
            position: absolute;
            top: 6%;
            width: 32cqw;
            height: 32cqw;
            border-radius: 50%;
            background: radial-gradient(circle at center, transparent 40%, rgba(200, 210, 220, 0.4) 70%, rgba(180, 190, 200, 0.7) 100%);
            box-shadow: inset 0 0 4cqw rgba(0, 0, 0, 0.1);
        }

        .gauge-left {
            left: 4%;
        }

        .gauge-right {
            right: 4%;
        }

        /* Blind-Spot Experience View */
        .experience-view {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: radial-gradient(circle at center, #ffffff 0%, #e4e7ec 100%);
            border-radius: 50%;
            overflow: hidden;
            box-shadow: inset 0 0 2cqw rgba(0, 0, 0, 0.1);
        }

        .mirror-title {
            position: absolute;
            top: 15%;
            font-size: 1.8cqw;
            color: #F46402;
            letter-spacing: 0.1cqw;
            z-index: 10;
        }

        .experience-stack {
            position: relative;
            width: 55%;
            height: 45%;
            perspective: 60cqw;
            transform-style: preserve-3d;
            margin-top: 15%;
        }

        .exp-card {
            position: absolute;
            width: 100%;
            height: 60%;
            background: #fff;
            border-radius: 1cqw;
            box-shadow: 0 1cqw 3cqw rgba(0, 0, 0, 0.2);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1.5cqw;
            box-sizing: border-box;
            border: 0.2cqw solid rgba(244, 100, 2, 0.2);
            transition: transform 0.5s ease;
        }

        .exp-name {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .exp-name img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .exp-1 {
            transform: translateZ(10cqw) translateY(6cqw);
            z-index: 3;
            background: #fff;
        }

        .exp-2 {
            transform: translateZ(-5cqw) translateY(-1cqw);
            z-index: 2;
            background: #f8f9fa;
            opacity: 0.95;
        }

        .exp-3 {
            transform: translateZ(-20cqw) translateY(-8cqw);
            z-index: 1;
            background: #e9ecef;
            opacity: 0.8;
        }

        /* Ticks and Labels */
        .tick-container {
            position: absolute;
            inset: 0;
        }

        .tick {
            position: absolute;
            top: 3%;
            left: 49.6%;
            width: 0.8%;
            height: 4%;
            background-color: #444;
            border-radius: 1cqw;
        }

        .label {
            position: absolute;
            font-size: 2.2cqw;
            font-weight: 500;
            color: #444;
            text-shadow: none;
        }

        /* Center Cap */
        .gauge-center-cap {
            position: absolute;
            top: 42%;
            left: 42%;
            width: 16%;
            height: 16%;
            background: radial-gradient(circle, #fff 0%, #e0e0e0 100%);
            border-radius: 50%;
            box-shadow: inset 0 0 1cqw #fff, 0 0.5cqw 1cqw rgba(0, 0, 0, 0.2);
            z-index: 10;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .gauge-center-inner {
            width: 40%;
            height: 40%;
            background: radial-gradient(circle, #fff 0%, #F46402 100%);
            border-radius: 50%;
            box-shadow: 0 0 0.5cqw rgba(244, 100, 2, 0.5);
        }

        /* Needle */
        .needle-container {
            position: absolute;
            inset: 0;
            z-index: 5;
            transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .needle {
            position: absolute;
            top: 18%;
            left: 49.3%;
            width: 1.4%;
            height: 34%;
            background: #F46402;
            border-radius: 1cqw;
            box-shadow: 0 0 1cqw #F46402, 0 0 0.2cqw #fff inset;
        }

        /* Gauge Sweep Effect */
        .gauge-sweep {
            position: absolute;
            inset: 15%;
            border-radius: 50%;
            background: conic-gradient(from 260deg at 50% 50%, rgb(255 255 255 / 0%) 20deg, #f46402a8 100deg, transparent 100deg);
        }

        .coasting-text {
            position: absolute;
            top: 25%;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 1.5cqw;
            color: #4CAF50;
            font-weight: bold;
            opacity: 0;
            transition: opacity 0.3s;
            letter-spacing: 0.2cqw;
        }

        /* Unit Labels */
        .gauge-unit {
            position: absolute;
            bottom: 28%;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 1.2cqw;
            color: #666;
            letter-spacing: 0.1cqw;
        }

        /* --- Sub-gauges (Fuel / Temp) NEW MATHEMATICALLY LOCKED CSS --- */
        .sub-gauge {
            position: absolute;
            bottom: 2%;
            left: 15%;
            width: 70%;
            height: 25%;
        }

        .sub-gauge svg {
            width: 100%;
            height: 100%;
            overflow: visible;
        }

        .sub-gauge text {
            font-family: Arial, sans-serif;
        }

        /* --- Corner Elements --- */
        .seo-logo {
            position: absolute;
            top: 3%;
            left: 1%;
            width: 4.5cqw;
            height: 4.5cqw;
            z-index: 20;
            object-fit: contain;
            opacity: 0.8;
            transition: opacity 0.3s, transform 0.3s;
        }

        .seo-logo:hover {
            opacity: 1;
            transform: scale(1.1);
        }

        /* --- Center & Top Elements --- */
        .top-indicators {
            position: absolute;
            top: 8%;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 29cqw;
            pointer-events: none;
            z-index: 10;
        }

        .gear {
            background: rgba(255, 255, 255, 0.9);
            border: 0.1cqw solid rgba(0, 0, 0, 0.1);
            padding: 0.5cqw 1.2cqw;
            border-radius: 0.8cqw;
            font-size: 3cqw;
            font-weight: 500;
            color: #222;
            box-shadow: 0 1cqw 2cqw rgba(0, 0, 0, 0.1);
        }

        .headlights {
            width: 3.5cqw;
            height: 3.5cqw;
            transform: translateY(0.5cqw);
            cursor: pointer;
            transition: transform 0.1s;
            pointer-events: auto;
        }

        .headlights:active {
            transform: translateY(0.5cqw) scale(0.9);
        }

        /* Career Journey Map */
        .nav-map {
            position: absolute;
            top: 15%;
            bottom: 21%;
            left: 37.5%;
            right: 37.5%;
            background: #f8f9fa;
            border-radius: 2cqw;
            box-shadow: inset 0 0 2cqw rgba(0, 0, 0, 0.05), 0 1cqw 2cqw rgba(0, 0, 0, 0.1);
            border: 0.1cqw solid rgba(255, 255, 255, 0.5);
            overflow: hidden;
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 0;
        }

        .nav-map svg {
            width: 100%;
            height: 100%;
        }

        /* Digital Speedometer (Hidden by default) */
        .digital-speedometer {
            position: absolute;
            top: 15%;
            bottom: 21%;
            left: 37.5%;
            right: 37.5%;
            background: #f8f9fa;
            border-radius: 2cqw;
            box-shadow: inset 0 0 2cqw rgba(0, 0, 0, 0.05), 0 1cqw 2cqw rgba(0, 0, 0, 0.1);
            border: 0.1cqw solid rgba(255, 255, 255, 0.5);
            display: none;
            /* hidden by default */
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 0;
        }

        .digital-speedometer.active {
            display: flex;
        }

        .digital-speed-val {
            font-size: 8cqw;
            font-weight: 900;
            color: #222;
            line-height: 1;
        }

        .digital-speed-unit {
            font-size: 1.5cqw;
            font-weight: bold;
            color: #666;
            margin-top: 0.5cqw;
        }

        /* Lane Assist (Hidden by default) */
        .lane-assist {
            position: absolute;
            top: 15%;
            bottom: 21%;
            left: 37.5%;
            right: 37.5%;
            background: #f8f9fa;
            border-radius: 2cqw;
            box-shadow: inset 0 0 2cqw rgba(0, 0, 0, 0.05), 0 1cqw 2cqw rgba(0, 0, 0, 0.1);
            border: 0.1cqw solid rgba(255, 255, 255, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 0;
            overflow: hidden;
        }

        .lane-assist.active {
            display: flex;
        }

        .lane-assist.dark-mode {
            background: #050505;
        }

        .lane-title {
            position: absolute;
            top: 10%;
            width: 100%;
            text-align: center;
            font-size: 1.2cqw;
            font-weight: 500;
            color: #8bbce1;
            /* Soft ice blue */
            letter-spacing: 0.1cqw;
            z-index: 2;
        }

        .lane-svg {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .lane-car {
            position: absolute;
            bottom: -5%;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            z-index: 3;
            mix-blend-mode: screen;
            transform-origin: bottom center;
        }

        /* Top Status Bar */
        .top-status-bar {
            position: absolute;
            top: 5%;
            left: 37.5%;
            right: 37.5%;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            z-index: 10;
            color: #666;
            transition: color 0.1s;
        }

        .status-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 1.8cqw;
        }

        .status-text {
            font-size: 1.2cqw;
            font-weight: 800;
            display: flex;
            align-items: center;
            height: 1.8cqw;
        }

        /* Now Playing View */
        .now-playing-view {
            position: absolute;
            top: 15%;
            bottom: 21%;
            left: 37.5%;
            right: 37.5%;
            background: #111;
            border-radius: 2cqw;
            box-shadow: inset 0 0 2cqw rgba(0, 0, 0, 0.5), 0 1cqw 2cqw rgba(0, 0, 0, 0.2);
            border: 0.1cqw solid rgba(255, 255, 255, 0.1);
            display: none;
            flex-direction: column;
            padding: 1.5cqw;
            box-sizing: border-box;
            z-index: 0;
            color: #fff;
        }

        .now-playing-view.active {
            display: flex;
        }

        .np-title {
            font-size: 1.2cqw;
            font-weight: 500;
            color: #8bbce1;
            margin-bottom: 1cqw;
            text-align: center;
            letter-spacing: 0.1cqw;
        }

        .np-list {
            display: flex;
            flex-direction: column;
            gap: 0.8cqw;
            flex: 1;
            overflow: hidden;
        }

        .np-item {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 0.8cqw;
            padding: 0.5cqw;
            transition: background 0.3s;
        }

        .np-item.playing {
            background: rgba(255, 255, 255, 0.15);
            border: 0.1cqw solid rgba(244, 100, 2, 0.5);
        }

        .np-cover {
            width: 3cqw;
            height: 3cqw;
            border-radius: 0.5cqw;
            object-fit: cover;
            margin-right: 1cqw;
        }

        .np-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .np-song {
            font-size: 1cqw;
            font-weight: bold;
            line-height: 1.2;
        }

        .np-artist {
            font-size: 0.8cqw;
            color: #aaa;
        }

        .np-eq {
            display: flex;
            gap: 0.2cqw;
            align-items: flex-end;
            height: 1cqw;
        }

        .np-bar {
            width: 0.3cqw;
            background: #F46402;
            animation: bounce 1s infinite alternate;
        }

        .np-bar:nth-child(2) {
            animation-delay: 0.2s;
        }

        .np-bar:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes bounce {
            0% {
                height: 20%;
            }

            100% {
                height: 100%;
            }
        }

        /* Mode Buttons Container */
        .center-buttons {
            position: absolute;
            bottom: 18%;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 1cqw;
            z-index: 10;
        }

        .mode-btn {
            background: rgba(255, 255, 255, 0.9);
            border: 0.1cqw solid rgba(0, 0, 0, 0.1);
            padding: 0.4cqw 1.5cqw;
            border-radius: 1cqw;
            font-size: 1.2cqw;
            font-weight: bold;
            color: var(--accent-color, #F46402);
            cursor: pointer;
            box-shadow: 0 0.5cqw 1cqw rgba(0, 0, 0, 0.1);
            transition: all 0.1s;
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
        }

        .mode-btn img {
            height: 1.6cqw;
            width: auto;
            object-fit: contain;
        }

        .mode-btn:hover {
            background: #fff;
        }

        .mode-btn:active {
            transform: scale(0.95);
        }

        /* Sport Mode Overrides */
        :host(.sport-mode) {
            --accent-color: #ff003c;
        }

        :host(.sport-mode) .cluster {
            background: radial-gradient(circle at center, #111 0%, #050505 100%);
            box-shadow: 0 0 10cqw rgba(255, 0, 60, 0.15);
            color: #fff;
        }

        :host(.sport-mode) .digital-speed-val,
        :host(.sport-mode) .speed-limit-value {
            color: #ff003c;
            font-style: italic;
        }

        :host(.sport-mode) .gauge {
            background: radial-gradient(circle at center, #222 0%, #050505 100%);
            box-shadow: inset 0 0 3cqw rgba(255, 0, 60, 0.15), 0 2cqw 4cqw rgba(0, 0, 0, 0.4);
            border: 0.15cqw solid rgba(255, 0, 60, 0.3);
        }

        :host(.sport-mode) .nav-map,
        :host(.sport-mode) .digital-speedometer,
        :host(.sport-mode) .lane-assist,
        :host(.sport-mode) .now-playing-view,
        :host(.sport-mode) .bottom-bar {
            background: #111;
            border-color: rgba(255, 0, 60, 0.2);
            box-shadow: inset 0 0 2cqw rgba(255, 0, 60, 0.05), 0 1cqw 2cqw rgba(0, 0, 0, 0.3);
        }

        :host(.sport-mode) .mpg-fill {
            background: var(--accent-color);
            box-shadow: 0 0 0.5cqw var(--accent-color);
        }

        :host(.sport-mode) .mpg-line {
            background: rgba(255, 255, 255, 0.15);
        }

        :host(.sport-mode) .mpg-labels {
            color: #aaa;
        }

        :host(.sport-mode) .speed-limit {
            background: #fff;
            border-color: #ff003c;
        }

        :host(.sport-mode) .speed-limit-text {
            color: #ff003c;
        }

        :host(.sport-mode) .gauge-sweep {
            background: conic-gradient(from 260deg at 50% 50%, rgb(255 255 255 / 0%) 20deg, rgba(255, 0, 60, 0.66) 100deg, transparent 100deg);
        }

        :host(.sport-mode) .needle {
            background: var(--accent-color);
            box-shadow: 0 0 1cqw var(--accent-color);
        }

        :host(.sport-mode) .gauge-center-inner {
            background: radial-gradient(circle at 30% 30%, #fff 0%, var(--accent-color) 50%, #80001e 100%);
            box-shadow: 0 0 1cqw var(--accent-color);
        }

        :host(.sport-mode) .np-bar {
            background: var(--accent-color);
        }

        :host(.sport-mode) path[stroke="#F46402"],
        :host(.sport-mode) circle[stroke="#F46402"] {
            stroke: var(--accent-color) !important;
        }

        :host(.sport-mode) .temp,
        :host(.sport-mode) .mpg,
        :host(.sport-mode) .corner-stat span,
        :host(.sport-mode) .gauge-unit,
        :host(.sport-mode) .label {
            color: #fff;
        }

        :host(.sport-mode) .tick {
            background: #fff;
        }

        :host(.sport-mode) .tick-container:nth-child(5n+1) .tick {
            background: var(--accent-color);
        }

        :host(.sport-mode) .lane-title,
        :host(.sport-mode) .np-title,
        :host(.sport-mode) .top-status-bar {
            color: var(--accent-color);
        }

        /* Speed Limit Sign */
        .speed-limit {
            position: absolute;
            top: 17%;
            left: 39%;
            background: #fff;
            color: #000;
            width: 3.5cqw;
            padding: 0.3cqw 0;
            text-align: center;
            border: 0.15cqw solid #000;
            border-radius: 0.5cqw;
            box-shadow: 0 0.5cqw 1cqw rgba(0, 0, 0, 0.2);
            font-family: Arial, sans-serif;
            z-index: 2;
        }

        .speed-limit-text {
            font-size: 0.6cqw;
            font-weight: 900;
            line-height: 1.1;
        }

        .speed-limit-value {
            font-size: 1cqw;
            font-weight: bold;
            margin-top: 0.1cqw;
            letter-spacing: -0.1cqw;
        }

        .speed-limit img {
            max-width: 80%;
            height: auto;
            display: block;
            margin: 0.2cqw auto;
        }

        /* Turn Indicators */
        .turn-indicator {
            position: absolute;
            top: 5%;
            font-size: 3cqw;
            color: rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: color 0.1s;
            user-select: none;
            z-index: 10;
            text-shadow: 0 0 1cqw rgba(0, 0, 0, 0.05);
        }

        .turn-indicator.left {
            left: 5%;
        }

        .turn-indicator.right {
            right: 5%;
        }

        .turn-indicator.blinking {
            animation: blinker 0.8s step-start infinite;
            color: #28a745;
            text-shadow: 0 0 1.5cqw #28a745;
        }

        @keyframes blinker {
            50% {
                color: rgba(0, 0, 0, 0.1);
                text-shadow: 0 0 1cqw rgba(0, 0, 0, 0.05);
            }
        }

        /* Bottom Status Bar */
        .bottom-bar {
            position: absolute;
            bottom: 3%;
            left: 30%;
            width: 40%;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(4px);
            border-radius: 2cqw;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8cqw 2cqw;
            box-sizing: border-box;
            border: 0.1cqw solid rgba(0, 0, 0, 0.1);
            box-shadow: 0 0.5cqw 1.5cqw rgba(0, 0, 0, 0.05);
        }

        .temp,
        .mpg {
            font-size: 1.6cqw;
        }

        .mpg span,
        .temp span {
            font-size: 1.1cqw;
            color: #666;
        }

        .mpg-gauge {
            flex-grow: 1;
            margin: 0 2cqw;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .mpg-labels {
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 1cqw;
            color: #666;
            margin-bottom: 0.3cqw;
        }

        .mpg-line {
            width: 100%;
            height: 0.2cqw;
            background: #ccc;
            position: relative;
        }

        .mpg-fill {
            position: absolute;
            left: 0;
            top: -0.1cqw;
            height: 0.4cqw;
            width: 45%;
            background: #F46402;
            border-radius: 0.2cqw;
            box-shadow: 0 0 0.5cqw #F46402;
        }

        /* Corner Stats */
        .corner-stat {
            position: absolute;
            bottom: 4%;
            font-size: 1.6cqw;
            display: flex;
            align-items: center;
            gap: 0.5cqw;
        }

        .corner-stat.left {
            left: 3%;
        }

        .corner-stat.right {
            right: 3%;
        }

        .corner-stat span {
            font-size: 1.2cqw;
            color: #666;
        }

        .corner-stat img {
            height: 2cqw;
            width: auto;
            object-fit: contain;
        }

        .icon-a {
            position: absolute;
            top: 15%;
            left: 15%;
            font-size: 1.2cqw;
            border: 0.1cqw solid #444;
            border-radius: 50%;
            width: 1.8cqw;
            height: 1.8cqw;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #444;
        }
    `;
    }

    getHtml() {
        return `<div class="cluster-wrapper">
        <div class="cluster">

            <img src="${this.basePath}/images/seo.png" class="seo-logo" alt="SEO Logo">

            <!-- Left Gauge: Speedometer -->
            <div class="gauge gauge-left">
                <div id="speedometer-view" style="transition: opacity 0.5s; width: 100%; height: 100%;">
                    <div id="coasting-text" class="coasting-text">COASTING</div>
                    <div id="speed-ticks"></div>
                    <div class="gauge-unit">MPH</div>

                    <div id="speed-needle" class="needle-container" style="transform: rotate(-135deg);">
                        <div class="gauge-sweep"></div>
                        <div class="needle"></div>
                    </div>
                    <div class="gauge-center-cap">
                        <div class="gauge-center-inner"></div>
                    </div>

                    <!-- PERFECTLY ALIGNED FUEL GAUGE -->
                    <div class="sub-gauge">
                        <svg viewBox="0 0 100 50">
                            <!-- Embedded Labels for perfect scaling relative to the path -->
                            <text x="13" y="28" font-size="6" text-anchor="middle" fill="#666"
                                font-weight="bold">E</text>
                            <text x="87" y="28" font-size="6" text-anchor="middle" fill="#666"
                                font-weight="bold">F</text>
                            <image href="${this.basePath}/images/fuel.png" x="42" y="34" width="16" height="16" />

                            <!-- Track: Center(50,50), Radius(40). Rotated to start at 220 deg. Length is 100 degrees of arc (69.8) -->
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="2"
                                stroke-dasharray="69.8 300" stroke-linecap="round" transform="rotate(220, 50, 50)" />

                            <!-- Fill: Exact same circle geometry, just a shorter dash array (75% full = 52.3) -->
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#F46402" stroke-width="2.5"
                                stroke-dasharray="52.3 300" stroke-linecap="round" transform="rotate(220, 50, 50)" />

                            <!-- Thumb: Positioned exactly at 0 degrees (cx=90) and rotated radially to 295 degrees (220 + 75) -->
                            <circle cx="90" cy="50" r="3.5" fill="#444" transform="rotate(295, 50, 50)" />
                        </svg>
                    </div>
                </div>

                <!-- Blind-Spot Experience View (Hidden initially) -->
                <div id="experience-view" class="experience-view"
                    style="display: none; opacity: 0; transition: opacity 0.5s;">
                    <div class="mirror-title">Experience</div>
                    <div class="experience-stack">
                        <div class="exp-card exp-3">
                            <div class="exp-name">
                                <img style="width: 100%"
                                    src="https://upload.wikimedia.org/wikipedia/commons/5/59/WU_LOGO.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
                                    alt="" srcset="">
                            </div>
                        </div>
                        <div class="exp-card exp-2">
                            <div class="exp-name">
                                <img style="width: 100%"
                                    src="https://www.ansys.com/content/dam/company/brand/logos/ansys-logos/ansys-logo.jpg"
                                    alt="" srcset="">
                            </div>
                        </div>
                        <div class="exp-card exp-1">
                            <div class="exp-name"><img style="width: 100%"
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu7UTwEnEDxph2NGZFTIcEglQ7WcFkwB3INki-c0wqzpqy_0Lx-Iaj83Q&s=10"
                                    alt="" srcset=""></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Center Display Area -->
            <div class="top-indicators">
                <div id="gear-indicator" class="gear">P</div>
                <img id="headlights-icon" class="headlights"
                    src="https://img.icons8.com/?size=100&id=55593&format=png&color=000000" alt="headlights">
            </div>

            <!-- Top Status Bar -->
            <div class="top-status-bar">
                <div class="status-icon">
                    <svg viewBox="0 0 100 100" style="height: 1.8cqw; width: auto; fill: currentColor;">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="8" />
                        <text x="50" y="55" font-size="28" font-weight="bold" font-family="Arial" text-anchor="middle"
                            alignment-baseline="middle">ABS</text>
                    </svg>
                </div>
                <div class="status-icon">
                    <svg viewBox="0 0 100 100" style="height: 1.8cqw; width: auto; fill: currentColor;">
                        <path d="M20,75 Q35,55 50,75 T80,75" fill="none" stroke="currentColor" stroke-width="6" />
                        <path d="M20,65 Q35,45 50,65 T80,65" fill="none" stroke="currentColor" stroke-width="6" />
                        <circle cx="35" cy="40" r="10" fill="none" stroke="currentColor" stroke-width="6" />
                        <circle cx="65" cy="40" r="10" fill="none" stroke="currentColor" stroke-width="6" />
                        <path d="M25,40 L30,25 L70,25 L75,40" fill="none" stroke="currentColor" stroke-width="6"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <div class="status-icon">
                    <svg viewBox="0 0 100 100" style="height: 1.8cqw; width: auto; fill: currentColor;">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="8" />
                        <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" stroke-width="8" />
                        <line x1="10" y1="50" x2="38" y2="50" stroke="currentColor" stroke-width="8" />
                        <line x1="90" y1="50" x2="62" y2="50" stroke="currentColor" stroke-width="8" />
                        <line x1="50" y1="90" x2="50" y2="62" stroke="currentColor" stroke-width="8" />
                    </svg>
                </div>
                <div class="status-text">NW</div>
                <div class="status-text">93°F</div>
            </div>

            <!-- Career Journey Navigation Map -->
            <div class="nav-map">
                <svg viewBox="-50 0 200 200" preserveAspectRatio="xMidYMid meet">
                    <!-- Base Grid/Background Texture -->
                    <rect x="-50" y="0" width="200" height="200" fill="#e8eaed" />
                    <!-- Horizontal Grid -->
                    <line x1="-50" y1="50" x2="150" y2="50" stroke="#fff" stroke-width="0.5" />
                    <line x1="-50" y1="100" x2="150" y2="100" stroke="#fff" stroke-width="0.5" />
                    <line x1="-50" y1="150" x2="150" y2="150" stroke="#fff" stroke-width="0.5" />
                    <!-- Vertical Grid -->
                    <line x1="-25" y1="0" x2="-25" y2="200" stroke="#fff" stroke-width="0.5" />
                    <line x1="25" y1="0" x2="25" y2="200" stroke="#fff" stroke-width="0.5" />
                    <line x1="75" y1="0" x2="75" y2="200" stroke="#fff" stroke-width="0.5" />
                    <line x1="125" y1="0" x2="125" y2="200" stroke="#fff" stroke-width="0.5" />

                    <!-- Route Path -->
                    <path
                        d="M 30 180 C 50 180, 70 163, 70 146 C 70 129, 40 129, 40 112 C 40 95, 70 95, 70 78 C 70 61, 30 61, 30 44 C 30 30, 50 30, 50 15"
                        fill="none" stroke="#F46402" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

                    <path
                        d="M 30 180 C 50 180, 70 163, 70 146 C 70 129, 40 129, 40 112 C 40 95, 70 95, 70 78 C 70 61, 30 61, 30 44 C 30 30, 50 30, 50 15"
                        fill="none" stroke="#F46402" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />

                    <!-- Stops -->
                    <g class="map-stops">
                        <!-- Linkcode -->
                        <circle cx="30" cy="180" r="2.5" fill="#fff" stroke="#F46402" stroke-width="1.5" />
                        <text x="25" y="180" fill="#202124" font-size="5" font-weight="bold" font-family="Arial"
                            text-anchor="end" alignment-baseline="middle">Linkcode</text>

                        <!-- Mindsclik -->
                        <circle cx="70" cy="146" r="2.5" fill="#fff" stroke="#F46402" stroke-width="1.5" />
                        <text x="75" y="146" fill="#202124" font-size="5" font-weight="bold" font-family="Arial"
                            text-anchor="start" alignment-baseline="middle">Mindsclik</text>

                        <!-- Western Union -->
                        <circle cx="40" cy="112" r="2.5" fill="#fff" stroke="#F46402" stroke-width="1.5" />
                        <text x="35" y="112" fill="#202124" font-size="5" font-weight="bold" font-family="Arial"
                            text-anchor="end" alignment-baseline="middle">Western Union</text>

                        <!-- Ansys -->
                        <circle cx="70" cy="78" r="2.5" fill="#fff" stroke="#F46402" stroke-width="1.5" />
                        <text x="75" y="78" fill="#202124" font-size="5" font-weight="bold" font-family="Arial"
                            text-anchor="start" alignment-baseline="middle">Ansys</text>

                        <!-- Synopsys -->
                        <circle cx="30" cy="44" r="2.5" fill="#fff" stroke="#F46402" stroke-width="1.5" />
                        <text x="25" y="44" fill="#202124" font-size="5" font-weight="bold" font-family="Arial"
                            text-anchor="end" alignment-baseline="middle">Synopsys</text>

                        <!-- Next Adventure -->
                        <circle cx="50" cy="15" r="3" fill="#ea4335" stroke="#fff" stroke-width="1" />
                        <text x="50" y="9" fill="#ea4335" font-size="6" font-weight="900" font-family="Arial"
                            text-anchor="middle">Next Adventure</text>
                    </g>

                    <!-- Static Nav Arrow -->
                    <path d="M -4 -4 L 6 0 L -4 4 L -2 0 Z" fill="#F46402" stroke="#fff" stroke-width="0.5"
                        transform="translate(40, 30) rotate(-36)" />
                </svg>
            </div>

            <!-- Digital Speedometer View -->
            <div id="digital-speed-view" class="digital-speedometer active">
                <div id="digital-speed-val" class="digital-speed-val">65</div>
                <div class="digital-speed-unit">MPH</div>
            </div>

            <!-- Lane Keep Assist View -->
            <div id="lane-assist-view" class="lane-assist dark-mode">
                <div class="lane-title">Lane Keeping Assist</div>
                <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" class="lane-svg">
                    <defs>
                        <linearGradient id="lane-fade" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stop-color="#39FF14" stop-opacity="0.9" />
                            <stop offset="70%" stop-color="#39FF14" stop-opacity="0.1" />
                            <stop offset="100%" stop-color="#39FF14" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                    <!-- Left Lane -->
                    <path id="left-lane-path" d="M -20 250 Q 27.5 150 75 50 L 80 50 Q 37.5 150 -5 250 Z"
                        fill="url(#lane-fade)" />
                    <!-- Right Lane -->
                    <path id="right-lane-path" d="M 220 250 Q 172.5 150 125 50 L 120 50 Q 162.5 150 205 250 Z"
                        fill="url(#lane-fade)" />
                </svg>
                <!-- Realistic Car Image -->
                <img id="lane-car-img" src="${this.basePath}/images/silver_car_rear.png" class="lane-car" alt="Ego Car">
            </div>

            <!-- Now Playing View -->
            <div id="now-playing-view" class="now-playing-view">
                <div class="np-title">Now Playing</div>
                <div class="np-list">
                    <div class="np-item playing">
                        <img src="${this.basePath}/images/sabrina.png" class="np-cover" alt="Sabrina">
                        <div class="np-info">
                            <div class="np-song">Espresso</div>
                            <div class="np-artist">Sabrina Carpenter</div>
                        </div>
                        <div class="np-eq">
                            <div class="np-bar"></div>
                            <div class="np-bar"></div>
                            <div class="np-bar"></div>
                        </div>
                    </div>
                    <div class="np-item">
                        <img src="${this.basePath}/images/tayna.png" class="np-cover" alt="Tayna">
                        <div class="np-info">
                            <div class="np-song">Si Ai</div>
                            <div class="np-artist">Tayna</div>
                        </div>
                    </div>
                    <div class="np-item">
                        <img src="${this.basePath}/images/doja.png" class="np-cover" alt="Doja">
                        <div class="np-info">
                            <div class="np-song">Kiss Me More</div>
                            <div class="np-artist">Doja Cat</div>
                        </div>
                    </div>
                    <div class="np-item">
                        <img src="${this.basePath}/images/camila.png" class="np-cover" alt="Camila">
                        <div class="np-info">
                            <div class="np-song">Move</div>
                            <div class="np-artist">Camila Cabello</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mode Buttons -->
            <div class="center-buttons">
                <button id="drive-mode-btn" class="mode-btn">▀▄▀▄ Normal ▄▀▄▀</button>
                <button id="mode-toggle-btn" class="mode-btn"><img
                        src="https://img.icons8.com/?size=50&id=aoBUWlzTsXAy&format=png&color=000000" alt=""></button>
            </div>

            <div class="speed-limit">
                <div class="speed-limit-text">SPEED<br>LIMIT</div>
                <div class="speed-limit-value"></div><img
                    src="https://img.icons8.com/?size=20&id=9430&format=png&color=000000" alt="" srcset="">
            </div>

            <div class="bottom-bar">
                <div class="temp">93<span>°F</span></div>
                <div class="mpg-gauge">
                    <div class="mpg-labels"><span>0</span><span>25</span><span>50</span></div>
                    <div class="mpg-line">
                        <div class="mpg-fill"></div>
                    </div>
                </div>
                <div class="mpg">20.3 <span>MPG</span></div>
            </div>

            <!-- Right Gauge: Tachometer -->
            <div class="gauge gauge-right">
                <div id="tachometer-view" style="transition: opacity 0.5s; width: 100%; height: 100%;">
                    <div class="icon-a">A</div>
                    <div id="tacho-ticks"></div>
                    <div class="gauge-unit">x1000rpm</div>

                    <div id="tacho-needle" class="needle-container" style="transform: rotate(-100deg);">
                        <div class="gauge-sweep"></div>
                        <div class="needle"></div>
                    </div>
                    <div class="gauge-center-cap">
                        <div class="gauge-center-inner"></div>
                    </div>

                    <!-- PERFECTLY ALIGNED TEMP GAUGE -->
                    <div class="sub-gauge">
                        <svg viewBox="0 0 100 50">
                            <text x="13" y="28" font-size="6" text-anchor="middle" fill="#666"
                                font-weight="bold">C</text>
                            <text x="87" y="28" font-size="6" text-anchor="middle" fill="#666"
                                font-weight="bold">H</text>
                            <image href="${this.basePath}/images/temp.png" x="42" y="34" width="16" height="16" />

                            <!-- Track: Same 100 degree arc (69.8) -->
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="2"
                                stroke-dasharray="69.8 300" stroke-linecap="round" transform="rotate(220, 50, 50)" />

                            <!-- Fill: 25% full = 17.4 -->
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#F46402" stroke-width="2.5"
                                stroke-dasharray="17.4 300" stroke-linecap="round" transform="rotate(220, 50, 50)" />

                            <!-- Thumb: Radial rotation to 245 degrees (220 + 25) -->
                            <circle cx="90" cy="50" r="3.5" fill="#444" transform="rotate(245, 50, 50)" />
                        </svg>
                    </div>
                </div>

                <!-- Blind-Spot Experience View Right (Hidden initially) -->
                <div id="experience-view-right" class="experience-view"
                    style="display: none; opacity: 0; transition: opacity 0.5s;">
                    <div class="mirror-title">Experience</div>
                    <div class="experience-stack">
                        <div class="exp-card exp-3">
                            <div class="exp-name">
                                <img style="width: 100%"
                                    src="https://upload.wikimedia.org/wikipedia/commons/5/59/WU_LOGO.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
                                    alt="" srcset="">
                            </div>
                        </div>
                        <div class="exp-card exp-2">
                            <div class="exp-name">
                                <img style="width: 100%"
                                    src="https://www.ansys.com/content/dam/company/brand/logos/ansys-logos/ansys-logo.jpg"
                                    alt="" srcset="">
                            </div>
                        </div>
                        <div class="exp-card exp-1">
                            <div class="exp-name"><img style="width: 100%"
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu7UTwEnEDxph2NGZFTIcEglQ7WcFkwB3INki-c0wqzpqy_0Lx-Iaj83Q&s=10"
                                    alt="" srcset=""></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Global Corner Stats -->
            <div class="corner-stat left"><img style="width: 5cqw;" src="${this.basePath}/images/fuel.png" alt="fuel" srcset="">
                215<span>mi</span>
            </div>
            <div id="odometer" class="corner-stat right">544<span>mi</span></div>

            <!-- Turn Indicators -->
            <div id="left-turn" class="turn-indicator left">&#9664;</div>
            <div id="right-turn" class="turn-indicator right">&#9654;</div>

        </div>
    </div>`;
    }

    initLogic() {
        const root = this.shadowRoot;
        
        function drawDial(containerId, maxVal, step, startAngle, endAngle) {
            const container = root.getElementById(containerId);
            const steps = maxVal / step;
            const totalRange = endAngle - startAngle;
            const angleStep = totalRange / steps;

            const radius = 35;

            for (let i = 0; i <= steps; i++) {
                const val = i * step;
                const angle = startAngle + (i * angleStep);

                const tickContainer = document.createElement('div');
                tickContainer.className = 'tick-container';
                tickContainer.style.transform = `rotate(${angle}deg)`;

                const tick = document.createElement('div');
                tick.className = 'tick';
                tickContainer.appendChild(tick);
                container.appendChild(tickContainer);

                const rad = (angle - 90) * (Math.PI / 180);
                const x = 50 + radius * Math.cos(rad);
                const y = 50 + radius * Math.sin(rad);

                const label = document.createElement('div');
                label.className = 'label';
                label.innerText = val;
                label.style.left = `${x}%`;
                label.style.top = `${y}%`;
                label.style.transform = 'translate(-50%, -50%)';

                container.appendChild(label);
            }
        }

        drawDial('speed-ticks', 160, 20, -135, 135);
        drawDial('tacho-ticks', 8, 1, -135, 135);

        // --- Car Simulation Logic ---
        const speedNeedle = root.getElementById('speed-needle');
        const tachoNeedle = root.getElementById('tacho-needle');
        const gearIndicator = root.getElementById('gear-indicator');
        const odometerEl = root.getElementById('odometer');
        const leftTurn = root.getElementById('left-turn');
        const rightTurn = root.getElementById('right-turn');
        const digitalSpeedValEl = root.getElementById('digital-speed-val');
        const leftLanePath = root.getElementById('left-lane-path');
        const rightLanePath = root.getElementById('right-lane-path');
        const laneCarImg = root.getElementById('lane-car-img');

        let currentSpeed = 65; // Start at a moving speed
        let targetSpeed = 65;
        let currentRpm = 2.5;
        let lastTime = performance.now();
        let laneCurveTime = 0; // For animating the lane curves

        // Initialize Career Odometer (Start date: 2019)
        const careerStartDate = new Date('2019-01-01').getTime();
        const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
        // Base mileage: 12,000 miles per year since 2019
        let totalCareerMiles = ((Date.now() - careerStartDate) / msPerYear) * 12000;

        // More realistic gear speeds (max speed per gear)
        const gearSpeeds = [20, 40, 60, 85, 115, 160];
        const gears = ['1', '2', '3', '4', '5', '6'];

        function updateCarSimulation(timestamp) {
            if (!timestamp) timestamp = performance.now();
            const dt = (timestamp - lastTime) / 1000;
            lastTime = timestamp;

            // Update Career Odometer Live
            if (dt > 0 && dt < 1) { // Prevent huge jumps if tab was inactive
                const milesDrivenThisFrame = (currentSpeed / 3600) * dt;
                totalCareerMiles += milesDrivenThisFrame;
                if (odometerEl) {
                    odometerEl.innerHTML = `${totalCareerMiles.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}<span>mi</span>`;
                }
            }

            // Speed logic: Smooth exponential interpolation
            let activeTargetSpeed = targetSpeed;
            if (leftTurn.classList.contains('blinking') || rightTurn.classList.contains('blinking')) {
                activeTargetSpeed = 10;
            }
            const diff = activeTargetSpeed - currentSpeed;
            currentSpeed += diff * (isSportMode ? 0.04 : 0.015); // Faster acceleration in Sport

            if (Math.abs(diff) < 0.1) {
                currentSpeed = activeTargetSpeed;
            }

            // Gear logic
            let currentGearIdx = 0;
            for (let i = 0; i < gearSpeeds.length; i++) {
                if (currentSpeed <= gearSpeeds[i] || i === gearSpeeds.length - 1) {
                    currentGearIdx = i;
                    break;
                }
            }

            // RPM logic
            let speedInGear = currentSpeed;
            let minSpeedForGear = currentGearIdx > 0 ? gearSpeeds[currentGearIdx - 1] : 0;
            let maxSpeedForGear = gearSpeeds[currentGearIdx];

            // Map the speed in current gear to an RPM range (e.g., 2000 to 6000 RPM)
            let gearRatio = (speedInGear - minSpeedForGear) / (maxSpeedForGear - minSpeedForGear);

            // Add a tiny random jitter to RPM for realism
            let rpmJitter = (Math.random() - 0.5) * 0.1;

            gearIndicator.innerText = gears[currentGearIdx];

            if (diff > 0.5) {
                // Accelerating: RPM is higher
                currentRpm = (isSportMode ? 4.5 : 3.0) + gearRatio * (isSportMode ? 3.5 : 3.5) + rpmJitter;
            } else if (diff < -0.5) {
                // Decelerating: RPM drops
                currentRpm = (isSportMode ? 3.0 : 2.0) + gearRatio * 2.0 + rpmJitter;
            } else {
                // Cruising speed: RPM sits steadily
                currentRpm = (isSportMode ? 3.5 : 2.5) + gearRatio * 2.0 + rpmJitter;
            }

            // Update Needles
            // Speed: 0 to 160 -> -135deg to 135deg (range 270)
            const speedAngle = -135 + (currentSpeed / 160) * 270;
            speedNeedle.style.transform = `rotate(${speedAngle}deg)`;

            // RPM: 0 to 8 -> -135deg to 135deg (range 270)
            const rpmAngle = -135 + (currentRpm / 8) * 270;
            tachoNeedle.style.transform = `rotate(${rpmAngle}deg)`;

            // Update digital speedometer
            if (digitalSpeedValEl) {
                digitalSpeedValEl.innerText = Math.round(currentSpeed);
            }

            // Animate Lane Curves (simulating winding roads)
            if (leftLanePath && rightLanePath) {
                const safeDt = Math.min(dt, 0.1); // Prevent huge jumps if tab was inactive
                // The speed affects how fast we progress through the curve
                laneCurveTime += safeDt * (currentSpeed / 60) * 0.25;

                // Use a mix of sine waves to create somewhat unpredictable winding (subtle)
                const curveOffset = Math.sin(laneCurveTime) * 12 + Math.sin(laneCurveTime * 0.43) * 6;

                // Update left lane
                // Base: M -20 250 Q 27.5 150 75 50 L 80 50 Q 37.5 150 -5 250 Z
                leftLanePath.setAttribute('d', `M -20 250 Q ${27.5 + curveOffset / 2} 150 ${75 + curveOffset} 50 L ${80 + curveOffset} 50 Q ${37.5 + curveOffset / 2} 150 -5 250 Z`);

                // Update right lane
                // Base: M 220 250 Q 172.5 150 125 50 L 120 50 Q 162.5 150 205 250 Z
                rightLanePath.setAttribute('d', `M 220 250 Q ${172.5 + curveOffset / 2} 150 ${125 + curveOffset} 50 L ${120 + curveOffset} 50 Q ${162.5 + curveOffset / 2} 150 205 250 Z`);

                // Subtly rotate the car to steer into the curve
                if (laneCarImg) {
                    laneCarImg.style.transform = `translateX(-50%) rotate(${curveOffset * 0.15}deg)`;
                }
            }

            requestAnimationFrame(updateCarSimulation);
        }

        // Change target speed at randomized intervals for a more natural, human-like driving pattern
        function scheduleNextSpeedChange() {
            // Wait anywhere from 3 to 10 seconds before the next speed adjustment
            const delay = Math.floor(Math.random() * 7000) + 3000;

            setTimeout(() => {
                // Target speed is always between 45 mph and 100 mph
                targetSpeed = Math.floor(Math.random() * 56) + 45;
                scheduleNextSpeedChange();
            }, delay);
        }
        scheduleNextSpeedChange();

        // Turn Indicators Logic
        const expView = root.getElementById('experience-view');
        const speedView = root.getElementById('speedometer-view');

        const expViewRight = root.getElementById('experience-view-right');
        const tachoView = root.getElementById('tachometer-view');

        function updateLeftGaugeView() {
            if (leftTurn.classList.contains('blinking')) {
                speedView.style.opacity = '0';
                setTimeout(() => {
                    if (!leftTurn.classList.contains('blinking')) return;
                    speedView.style.display = 'none';
                    expView.style.display = 'flex';
                    void expView.offsetWidth;
                    expView.style.opacity = '1';
                }, 500);
            } else {
                expView.style.opacity = '0';
                setTimeout(() => {
                    if (leftTurn.classList.contains('blinking')) return;
                    expView.style.display = 'none';
                    speedView.style.display = 'block';
                    void speedView.offsetWidth;
                    speedView.style.opacity = '1';
                }, 500);
            }
        }

        function updateRightGaugeView() {
            if (rightTurn.classList.contains('blinking')) {
                tachoView.style.opacity = '0';
                setTimeout(() => {
                    if (!rightTurn.classList.contains('blinking')) return;
                    tachoView.style.display = 'none';
                    expViewRight.style.display = 'flex';
                    void expViewRight.offsetWidth;
                    expViewRight.style.opacity = '1';
                }, 500);
            } else {
                expViewRight.style.opacity = '0';
                setTimeout(() => {
                    if (rightTurn.classList.contains('blinking')) return;
                    expViewRight.style.display = 'none';
                    tachoView.style.display = 'block';
                    void tachoView.offsetWidth;
                    tachoView.style.opacity = '1';
                }, 500);
            }
        }

        leftTurn.addEventListener('click', () => {
            leftTurn.classList.toggle('blinking');
            if (leftTurn.classList.contains('blinking')) {
                rightTurn.classList.remove('blinking');
                updateRightGaugeView();
            }
            updateLeftGaugeView();
        });

        rightTurn.addEventListener('click', () => {
            rightTurn.classList.toggle('blinking');
            if (rightTurn.classList.contains('blinking')) {
                leftTurn.classList.remove('blinking');
                updateLeftGaugeView();
            }
            updateRightGaugeView();
        });

        // Headlights Logic
        const headlightsIcon = root.getElementById('headlights-icon');
        let headlightsOn = false;
        headlightsIcon.addEventListener('click', () => {
            headlightsOn = !headlightsOn;
            headlightsIcon.src = headlightsOn
                ? 'https://img.icons8.com/?size=100&id=55593&format=png&color=00a473'
                : 'https://img.icons8.com/?size=100&id=55593&format=png&color=000000';
        });

        // Drive Mode Logic
        const driveModeBtn = root.getElementById('drive-mode-btn');
        let isSportMode = false;

        driveModeBtn.addEventListener('click', () => {
            isSportMode = !isSportMode;
            if (isSportMode) {
                this.classList.add('sport-mode');
                driveModeBtn.innerHTML = '▀▄▀▄ Sport ▄▀▄▀';
                driveModeBtn.style.color = '#ff003c';
            } else {
                this.classList.remove('sport-mode');
                driveModeBtn.innerHTML = '▀▄▀▄ Normal ▄▀▄▀';
                driveModeBtn.style.color = 'var(--accent-color, #F46402)';
            }
        });

        // Mode Toggle Logic
        const modeBtn = root.getElementById('mode-toggle-btn');
        const navMap = root.querySelector('.nav-map');
        const digitalSpeedView = root.getElementById('digital-speed-view');
        const laneAssistView = root.getElementById('lane-assist-view');

        const nowPlayingView = root.getElementById('now-playing-view');

        let currentMode = 1; // 0: Nav, 1: Speed, 2: Lane, 3: Music

        modeBtn.addEventListener('click', () => {
            currentMode = (currentMode + 1) % 4;

            // Hide everything first
            navMap.style.display = 'none';
            digitalSpeedView.classList.remove('active');
            laneAssistView.classList.remove('active');
            nowPlayingView.classList.remove('active');

            // Show active
            if (currentMode === 0) {
                navMap.style.display = 'flex';
            } else if (currentMode === 1) {
                digitalSpeedView.classList.add('active');
            } else if (currentMode === 2) {
                laneAssistView.classList.add('active');
            } else if (currentMode === 3) {
                nowPlayingView.classList.add('active');
            }
        });

        // Start simulation
        requestAnimationFrame(updateCarSimulation);
    
    }
}

customElements.define('instrument-cluster', InstrumentCluster);
