class Spinner {

  static build(){
    const style = DCreate('STYLE', {text: `
      #hourglass-spinner {
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) translateZ(0);
        width: 56px; height: 88px; z-index: 10000; pointer-events: none;
        display: flex; flex-direction: column; align-items: center;
      }
      #hourglass-spinner.hidden { display: none; }

      #hourglass-spinner .rig {
        display: flex; flex-direction: column; align-items: center;
        transition: transform 0.5s ease-in, opacity 0.5s ease-in;
      }
      #hourglass-spinner.stopping .rig {
        transform: rotate(360deg);
        opacity: 0;
      }

      #hourglass-spinner .bulb {
        position: relative;
        width: 56px; height: 40px;
        overflow: hidden;
        background: #0a0a0a;
      }
      #hourglass-spinner .bulb.top    { clip-path: polygon(0 0, 100% 0, 50% 100%); }
      #hourglass-spinner .bulb.bottom { clip-path: polygon(50% 0, 100% 100%, 0 100%); }

      #hourglass-spinner .glass {
        position: absolute; inset: 2px;
        background: rgba(100, 100, 100, 0.7);
      }
      #hourglass-spinner .sand {
        position: absolute; inset: 2px;
        background: #e0a838;
        transform-origin: 50% 100%;
        will-change: transform;
      }

      #hourglass-spinner .neck { width: 2px; height: 6px; background: rgba(110, 110, 110, 0.55); }

      #hourglass-spinner .bulb.top .sand {
        animation: hourglass-drain 8s linear infinite;
      }
      #hourglass-spinner .bulb.bottom .sand {
        transform: scaleY(0.07);
        animation: hourglass-fill 8s linear infinite;
      }

      @keyframes hourglass-drain {
        0%   { transform: scaleY(1); }
        80%  { transform: scaleY(0.07); }
        100% { transform: scaleY(0.07); }
      }
      @keyframes hourglass-fill {
        0%   { transform: scaleY(0.07); }
        80%  { transform: scaleY(1); }
        100% { transform: scaleY(1); }
      }

      @media (prefers-reduced-motion: reduce) {
        #hourglass-spinner .sand { animation: none; }
      }
    `})
    document.head.appendChild(style)

    const wrap = DCreate('DIV', {id: 'hourglass-spinner', class: 'hidden'})
    wrap.innerHTML = `
      <div class="rig">
        <div class="bulb top"><div class="glass"></div><div class="sand"></div></div>
        <div class="neck"></div>
        <div class="bulb bottom"><div class="glass"></div><div class="sand"></div></div>
      </div>
    `
    document.body.appendChild(wrap)

    this._el = wrap
    this._built = true
  }

  static start(){
    if (this.running) return
    this.running = true
    this._built || this.build()
    clearTimeout(this._stopTimeout)
    this._el.classList.remove('stopping')
    this._el.classList.remove('hidden')
  }

  static stop(){
    if ( !this.running) return
    this.running = false
    if ( !this._el) return
    this._el.classList.add('stopping')
    this._stopTimeout = setTimeout(() => {
      this._el.classList.add('hidden')
      this._el.classList.remove('stopping')
    }, 500)
  }

}
