(function ($) {

    function _select(field) {
        let options = (field.titleMap || []).map(opt => {
            return `<option value="${opt.value}">${opt.name}</option>`;
        });

        return `
        <select name="${field.name}">
            ${options.join("")}
        </select>
        `;
    }

    $.fn.searchWidget = function (options) {
        let settings = $.extend({
            fields: [],
            onSearch: () => {}
        }, options),
        fields =[ 
            _select({ 
                name: 'from', 
                titleMap: [{
                    name: 'Sydney',
                    value: 'SYD'
                }, {
                    name: 'Melbourne',
                    value: 'MEL'
                }]
            })
        ];

        $(`<form>${fields.join("")}</form>`).appendTo(this);
    };

}( jQuery ));