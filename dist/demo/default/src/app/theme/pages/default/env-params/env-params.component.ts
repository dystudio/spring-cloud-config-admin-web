import {OnInit, AfterViewInit} from '@angular/core';
import {Component} from '@angular/core';
import {ScriptLoaderService} from '../../../../_services/script-loader.service';
import {Ajax} from '../../../../shared/ajax/ajax.service';

declare let $: any;
declare let toastr: any;
@Component({
    templateUrl: './env-params.component.html',
})
export class EnvParamsComponent implements OnInit, AfterViewInit {
    formData: any = {
        type: 'add',
        pKey: '',
        pValue: '',
    };
    dataList: any[] = [];
    datatable: any = null;
    constructor(private _script: ScriptLoaderService, private ajax: Ajax) {}

    ngAfterViewInit(): void {
        this.initData();
    }
    ngOnInit(): void {}

    async initData() {
        await this.initEnvList();
        await this.initEnvParamList();
    }

    async initEnvList() {
        let result = await this.ajax.get('/xhr/env');
        let selectData = result.map(item => {
            return {
                id: item.id,
                text: item.name,
            };
        });
        $('#m_select2_5').select2({
            placeholder: '请选择一个环境',
            data: selectData,
        });
        $('#m_select2_5').change(() => {
            this.initEnvParamList();
        });
    }

    async initEnvParamList() {
        let envParam = $('#m_select2_5').val();
        // let result = await this.ajax.get('/xhr/envParam', {
        //     envId: envParam,
        // });
        var options = {
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '/xhr/envParam',
                        method: 'GET',
                        params: {
                            envId: envParam,
                        },
                        map: function(raw) {
                            // sample data mapping
                            var dataSet = raw;
                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data;
                            }
                            return dataSet;
                        },
                    },
                },
                pageSize: 10,
                saveState: {
                    cookie: true,
                    webstorage: true,
                },

                serverPaging: false,
                serverFiltering: false,
                serverSorting: false,
                autoColumns: false,
            },

            layout: {
                theme: 'default',
                class: 'm-datatable--brand',
                scroll: true,
                height: null,
                footer: false,
                header: true,

                smoothScroll: {
                    scrollbarShown: true,
                },

                spinner: {
                    overlayColor: '#000000',
                    opacity: 0,
                    type: 'loader',
                    state: 'brand',
                    message: true,
                },

                icons: {
                    sort: {asc: 'la la-arrow-up', desc: 'la la-arrow-down'},
                    pagination: {
                        next: 'la la-angle-right',
                        prev: 'la la-angle-left',
                        first: 'la la-angle-double-left',
                        last: 'la la-angle-double-right',
                        more: 'la la-ellipsis-h',
                    },
                    rowDetail: {
                        expand: 'fa fa-caret-down',
                        collapse: 'fa fa-caret-right',
                    },
                },
            },

            sortable: true,

            pagination: true,

            search: {
                // enable trigger search by keyup enter
                onEnter: false,
                // input text for search
                input: $('#generalSearch'),
                // search delay in milliseconds
                delay: 200,
            },

            rows: {
                callback: function() {},
                // auto hide columns, if rows overflow. work on non locked columns
                autoHide: false,
            },

            // columns definition
            columns: [
                {
                    field: 'id',
                    title: 'id',
                    width: 80,
                    textAlign: 'center',
                    overflow: 'visible',
                    template: '{{id}}',
                },
                {
                    field: 'pkey',
                    title: '配置key',
                    sortable: 'asc',
                    filterable: false,
                    width: 100,
                    responsive: {visible: 'lg'},
                    template: '{{pkey}}',
                },
                {
                    field: 'pValue',
                    title: '配置key',
                    width: 300,
                    overflow: 'visible',
                    template: '{{registryAddress}}',
                },
                {
                    field: 'envParams',
                    title: '操作',
                    sortable: false,
                    width: 100,
                    overflow: 'visible',
                    template: `<div class="item-operate" data-info={{id}}>
                        <a class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill modifyItem" title="View">
                          <i class="la la-edit"></i>
                        </a>
                        <a class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill deleteItem" title="View">
                          <i class="la la-trash"></i>
                        </a></div>`,
                },
            ],

            toolbar: {
                layout: ['pagination', 'info'],

                placement: ['bottom'], //'top', 'bottom'

                items: {
                    pagination: {
                        type: 'default',

                        pages: {
                            desktop: {
                                layout: 'default',
                                pagesNumber: 6,
                            },
                            tablet: {
                                layout: 'default',
                                pagesNumber: 3,
                            },
                            mobile: {
                                layout: 'compact',
                            },
                        },

                        navigation: {
                            prev: true,
                            next: true,
                            first: true,
                            last: true,
                        },

                        pageSizeSelect: [10, 20, 30, 50, 100],
                    },

                    info: true,
                },
            },

            translate: {
                records: {
                    processing: '正在获取环境列表',
                    noRecords: '当前还没有配置环境',
                },
                toolbar: {
                    pagination: {
                        items: {
                            default: {
                                first: '首页',
                                prev: '上一页',
                                next: '下一页',
                                last: '末页',
                                more: '更多页',
                                input: 'Page number',
                                select: '请选择每页显示数量',
                            },
                            info:
                                '显示第 {{start}} - {{end}} 条记录，总共 {{total}} 条',
                        },
                    },
                },
            },
        };
        this.datatable = (<any>$('#m_datatable')).mDatatable(options);
    }

    createEnvParam() {
        $('#m_modal_1').modal('show');
    }

    closeModal() {
        $('#m_modal_1').modal('hide');
    }

    async saveModal() {
        try {
            let params = {
                id: -1,
                pKey: this.formData.pKey,
                pValue: this.formData.pValue,
            };
            let result = await this.ajax.post(
                '/xhr/envParam?envId=' + $('#m_select2_5').val(),
                params
            );
            toastr.success('新增环境成功!');
            $('#m_modal_1').modal('hide');
            this.datatable.reload();
        } catch (e) {
            toastr.error('新增环境失败!');
        }
    }
}