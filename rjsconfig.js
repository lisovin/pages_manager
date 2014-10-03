/*jshint ignore:start*/
require({
    config: {
        'scalejs.statechart-scion': {
            logStatesEnteredAndExited: true
        }
    },
    baseUrl: 'src',
    scalejs: {
        extensions: [
            'scalejs.mvvm',
            'scalejs.statechart-scion',
            'scalejs.functional',
            'scalejs.linq-linqjs',
            'scalejs.ratchet',
            'scalejs.facebook'
        ]
    },
    map: {
        '*': {
            sandbox: 'scalejs.sandbox',
            bindings: 'scalejs.mvvm.bindings',
            views: 'scalejs.mvvm.views'
        }
    },
    paths: {
        almond: '../lib/almond/almond',
        requirejs: '../lib/requirejs/require',
        scalejs: '../lib/scalejs/dist/scalejs.min',
        ratchet: '../lib/ratchet/dist/js/ratchet',
        knockout: '../lib/knockout/dist/knockout',
        'knockout.mapping': '../lib/knockout.mapping/knockout.mapping',
        'scalejs.functional': '../lib/scalejs.functional/dist/scalejs.functional.min',
        text: '../lib/text/text',
        'scalejs.statechart-scion': '../lib/scalejs.statechart-scion/dist/scalejs.statechart-scion.min',
        'scalejs.linq-linqjs': '../lib/scalejs.linq-linqjs/dist/scalejs.linq-linqjs.min',
        linqjs: '../lib/linqjs/linq',
        'scion-ng': '../lib/scion-ng/lib/scion',
        'scalejs.mvvm': '../lib/scalejs.mvvm/dist/scalejs.mvvm',
        'scalejs.mvvm.bindings': '../lib/scalejs.mvvm/dist/scalejs.mvvm',
        'scalejs.mvvm.views': '../lib/scalejs.mvvm/dist/scalejs.mvvm',
        'scalejs.ratchet': 'ext/scalejs.ratchet',
        'font-awesome': '../lib/font-awesome/fonts/*',
        jquery: '../lib/jquery/dist/jquery',
        facebook: '//connect.facebook.net/en_US/sdk/debug',
        'scalejs.facebook': 'ext/scalejs.facebook',
        moment: '../lib/moment/moment',
        package: '../lib/package/dist/scalejs.mvvm.min',
        hello: '../lib/hello/dist/hello.all',
        'scalejs.routing-historyjs': '../lib/scalejs.routing-historyjs/dist/scalejs.routing-historyjs.min'
    },
    shim: {
        facebook: {
            exports: 'FB'
        }
    },
    packages: [

    ]
});
/*jshint ignore:end*/


