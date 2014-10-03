/*
define('text!scalejs.ratchet/toggle/toggle.html', [], function () {
    'use strict';

    return  '<div class="toggle">' +
                    '<div class="toggle-handle"></div>' +
                '</div>';
});
*/
define('scalejs.ratchet/toggle/toggle',[
    //'text!scalejs.ratchet/toggle/toggle.html',
    'scalejs!core',
    'knockout'
], function (
    //toggleTemplate,
    core,
    ko
) {
    'use strict';

    var toggleTemplate = '<div class="toggle">' +
                    '<div class="toggle-handle"></div>' +
                '</div>';

    function toggle(options) {

    }

    return {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                var toggleEl = ko.virtualElements.firstChild(componentInfo.element);
                toggleEl.addEventListener('toggle', function () {
                    console.log('--->Toggled!!');
                    params.isOn(!params.isOn());
                });

                return toggle(params);
            }
        },
        template: toggleTemplate
    };
});

define('scalejs.ratchet',[
    'knockout',
    'knockout.mapping',
    'ratchet'
], function (
    ko
) {
    'use strict';

    ko.components.register('ratchet-toggle', { require: 'scalejs.ratchet/toggle/toggle' });
});
