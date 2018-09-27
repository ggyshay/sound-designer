export default  {
    knobX: 71,
    knobY: 71,
    svg:`
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="208px" height="208px" viewBox="0 0 208 208" version="1.1">
    <!-- Generator: Sketch 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
    <desc>Created with Sketch.</desc>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="s11" transform="translate(4.000000, 4.000000)">
            <g id="container">
                <g id="knob" transform="translate(29.000000, 29.431373)">
                    <circle id="Oval-5" fill="#322E2E" cx="71" cy="71" r="71"/>
                    <path d="M72.5,1.61251045 L89,14.78544 C81.8011199,16.0640554 76.3011199,16.7033631 72.5,16.7033631 C68.6988801,16.7033631 63.1988801,16.0640554 56,14.78544 L72.5,1.61251045 Z" id="Rectangle" fill="#DA0027" transform="translate(72.500000, 9.157937) scale(1, -1) translate(-72.500000, -9.157937) "/>
                </g>
                <g id="label" transform="translate(0.000000, 1.000000)">
                    <g id="labeltext" fill-opacity="1" fill="#DA0027">
                        <text id="ae85323a-4de4-34dc-f124-25c714280764" font-family="Helvetica" font-size="44" font-weight="normal" fill="#E9E9E9" class="text-7">
            <tspan x="45" y="115.509804">10.10</tspan>
        </text>
                        <text id="bdf7122e-7cde-aa3f-fab7-42f7b8a8c904" font-family="Helvetica" font-size="44" font-weight="normal" fill="#E9E9E9" class="text-7">
            <tspan x="45" y="115.509804">10.10</tspan>
        </text>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>
`,
updateAttributes: [
    {
      element: "#labeltext text tspan",
      content: (props, value) => {
        return value.toFixed(0);
      },
      attrs: [
        {
          name: "text-anchor",
          value: (props, value) => {
            return "middle";
          }
        },
        {
          name: "x",
          value: (props, value) => {
            return "100";
          }
        }
      ]
    }
  ]
}