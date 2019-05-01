<!--<script type="text/javascript">-->
    $( document ).on( "click", "#buy-item", function(e) {
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: 'https://www.seal-mc.com/webshop/api/viewItem/'+$(this).attr('data-id'),
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            beforeSend: function(){
                $('#viewItem').modal('show');
                $('#load-item').attr('align', 'center').html('<i class="fa fa-circle-o-notch fa-4x fa-spin text-center"></i>');
            },
            success: function( data ) {
                $('#load-item').attr('align', 'left').html(data);
            // SELECTRIC
                $('select').selectric({
                    responsive: true
                });
            },
            error: function () {
                $('#viewItem').modal('hide');
                $.notify(
                    {
                        message: 'Item not found or your session already expired, please re-login!'
                    },
                    {
                        type: 'danger',
                        allow_dismiss: true,
                        z_index: 99999999,
                        animate: {
                            enter: 'animated fadeInDown',
                            exit: 'animated fadeOutUp'
                        }
                    }
                )
            }
        });
    });

    $( document ).on( "click", "#buy-proc", function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: 'https://www.seal-mc.com/webshop/api/buyItem',
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            data: {pw: $('#bank_pw').val(), buy_id: $(this).attr('data-buy'), payment: 0},
            success: function( data ) {
                var tp = '';
                if(data.success == false){
                    tp = 'danger';
                }else{
                    tp = 'success';
                }
                $.notify(
                    {
                        message: data.messages
                    },
                    {
                        type: tp,
                        allow_dismiss: true,
                        z_index: 99999999,
                        animate: {
                            enter: 'animated fadeInDown',
                            exit: 'animated fadeOutUp'
                        }
                    }
                )
            },
            error: function () {
                $('#viewItem').modal('hide');
                $.notify(
                    {
                        message: 'Item not found or your session already expired, please re-login!'
                    },
                    {
                        type: 'danger',
                        allow_dismiss: true,
                        z_index: 99999999,
                        animate: {
                            enter: 'animated fadeInDown',
                            exit: 'animated fadeOutUp'
                        }
                    }
                )
            }
        });
    });

    $(function() {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var searchParam = url.searchParams.get("showItem");

        var dt = $('#items-table').DataTable({
            processing: true,
            serverSide: true,
            bInfo : false,
            bLengthChange: false,
            iDisplayLength: 8,
            autoWidth: false,
            responsive: false,
            oSearch: {
                "sSearch": searchParam !== undefined || searchParam !== null ? searchParam : " "
            },
            deferRender: true,
            sDom: '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f>>t<"text-center tp"rp>',
            oLanguage: {sProcessing: '<div class="dtt-loading"><i class="fa fa-circle-o-notch fa fa-spin"></i> Loading...</div>'},
            ajax: {
                url: 'https://www.seal-mc.com/webshop/api/itemList',
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                type: 'POST',
                dataType: 'JSON',
                error: function (xhr, textStatus, thrown) {
                    $.notify(
                        {
                            message: 'Your session already expired, please re-login!'
                        },
                        {
                            type: 'danger',
                            allow_dismiss: true,
                            z_index: 99999999,
                            animate: {
                                enter: 'animated fadeInDown',
                                exit: 'animated fadeOutUp'
                            }
                        }
                    )
                }
            },
            columns: [
                { data: 'images', name: 'images', orderable: false, searchable: false },
                { data: 'name', name: 'name' },
                { data: 'categoryid', name: 'categoryid', searchable: true },
                { data: 'stock_formatted', name: 'stock' },
                { data: 'price_formatted', name: 'price' },
                { data: 'action', name: 'action', orderable: false, searchable: false, sClass: 'text-right' }
            ],
            initComplete: function () {
                this.api().column(2).every( function () {
                    var column = this;
                    var select = $('#search-cat')
                        .on( 'change', function () {
                            var val = $.fn.dataTable.util.escapeRegex($(this).val());
                            column
                                .search( val ? '^'+val+'$' : '', true, false )
                                .draw();
                        } );
                } );
            }
        });
    });
    <!--</script>-->