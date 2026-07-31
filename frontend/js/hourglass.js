class Spinner {

  static build(){
    const style = DCreate('STYLE', {text: `
      #hourglass-spinner {
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 64px; height: 64px; z-index: 10000; pointer-events: none;
      }
      #hourglass-spinner.hidden { display: none; }
      #hourglass-spinner .frame { fill: none; stroke: #2b2b2b; stroke-width: 4; stroke-linejoin: round; }
      #hourglass-spinner .sand { fill: #c9963f; }
      #hourglass-spinner .top-sand, #hourglass-spinner .bottom-sand {
        transform-box: fill-box; transform-origin: 50% 100%;
      }
      #hourglass-spinner .top-sand    { animation: hourglass-drain 2.2s linear infinite; }
      #hourglass-spinner .bottom-sand { animation: hourglass-fill  2.2s linear infinite; }
      @keyframes hourglass-drain {
        0%   { transform: scaleY(1); }
        95%  { transform: scaleY(0); }
        100% { transform: scaleY(0); }
      }
      @keyframes hourglass-fill {
        0%   { transform: scaleY(0); }
        5%   { transform: scaleY(0); }
        100% { transform: scaleY(1); }
      }
      @media (prefers-reduced-motion: reduce) {
        #hourglass-spinner .top-sand, #hourglass-spinner .bottom-sand { animation: none; }
      }
    `})
    document.head.appendChild(style)

    const wrap = DCreate('DIV', {id: 'hourglass-spinner', class: 'hidden'})
    wrap.innerHTML = `
      <svg viewBox="0 0 100 100" aria-label="Chargement en cours">
        <clipPath id="hourglass-clip-top">
          <polygon points="22,8 78,8 50,48" />
        </clipPath>
        <clipPath id="hourglass-clip-bottom">
          <polygon points="50,52 78,92 22,92" />
        </clipPath>
        <g clip-path="url(#hourglass-clip-top)">
          <rect class="sand top-sand" x="15" y="8" width="70" height="40" />
        </g>
        <g clip-path="url(#hourglass-clip-bottom)">
          <rect class="sand bottom-sand" x="15" y="52" width="70" height="40" />
        </g>
        <path class="frame" d="M18,6 H82 M18,94 H82
                                M22,8 L78,8 L50,50 L78,92 L22,92 L50,50 Z" />
      </svg>
    `
    document.body.appendChild(wrap)

    this._el = wrap
    this._built = true
  }

  static start(){
    if (this.running) return
    this.running = true
    this._built || this.build()
    this._el.classList.remove('hidden')
  }

  static stop(){
    if ( !this.running) return
    this.running = false
    this._el && this._el.classList.add('hidden')
  }

}
