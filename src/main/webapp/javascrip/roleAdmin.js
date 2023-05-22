var dataMain = []
const getData = ()=>{
    $.ajax({
        statusCode: {
            401: function() {
                swal("Bạn không có quyền thực hiện chức năng này.!", {});
            }
        },
        url: "/api/role",
        method: "GET",
        success: res =>{
            dataMain = JSON.parse(res)
            initTable(dataMain)

        },
        error: err=>{

        }
    })
}
const getPermission = ()=>{
    $.ajax({
        statusCode: {
            401: function() {
                swal("Bạn không có quyền thực hiện chức năng này.!", {});
            }
        },
        url: "/api/permission",
        method: "GET",
        success: res =>{
            let data = JSON.parse(res)
            let elm = ``
            data.map(tmp=>{
                elm += `<option value="${tmp.id}">${tmp.name}</option>`
            })
            console.log(data, elm)
            document.querySelector('#field2').innerHTML = elm
            MultiselectDropdown(window.MultiselectDropdownOptions);

        },
        error: err=>{

        }
    })
}
getPermission()
const initTable = (data)=>{
    $('#myTable').DataTable({
        data: data,
        columns: [
            { data: "id" },
            { data: "name" },

            {data:"","render": function (data, type, row, meta) {

                        return `
                                <div style="text-align: center">
                                <button class="btn btn-success" style="font-size: 10px">Chi tiết</button>
                                <button class="btn btn-success" style="font-size: 10px">Cập nhập</button>
                                <button class="btn btn-danger" style="font-size: 10px">Xóa</button>
</div>`;


                }}
        ],
        buttons: [
            'excel', 'pdf'
        ]
    });

}
getData()


var style = document.createElement('style');
style.setAttribute("id","multiselect_dropdown_styles");


function MultiselectDropdown(options){
    var config={
        search:true,
        height:'15rem',
        placeholder:'Select',
        txtSelected:'Selected',
        txtAll:'All',
        txtRemove: 'Remove',
        txtSearch:'Search',
        ...options
    };
    function newEl(tag,attrs){
        var e=document.createElement(tag);
        if(attrs!==undefined) Object.keys(attrs).forEach(k=>{
            if(k==='class') { Array.isArray(attrs[k]) ? attrs[k].forEach(o=>o!==''?e.classList.add(o):0) : (attrs[k]!==''?e.classList.add(attrs[k]):0)}
            else if(k==='style'){
                Object.keys(attrs[k]).forEach(ks=>{
                    e.style[ks]=attrs[k][ks];
                });
            }
            else if(k==='text'){attrs[k]===''?e.innerHTML='&nbsp;':e.innerText=attrs[k]}
            else e[k]=attrs[k];
        });
        return e;
    }


    document.querySelectorAll("select[multiple]").forEach((el,k)=>{

        var div=newEl('div',{class:'multiselect-dropdown',style:{width:config.style?.width??el.clientWidth+'px',padding:config.style?.padding??''}});
        el.style.display='none';
        el.parentNode.insertBefore(div,el.nextSibling);
        var listWrap=newEl('div',{class:'multiselect-dropdown-list-wrapper'});
        var list=newEl('div',{class:'multiselect-dropdown-list',style:{height:config.height}});
        var search=newEl('input',{class:['multiselect-dropdown-search'].concat([config.searchInput?.class??'form-control']),style:{width:'100%',display:el.attributes['multiselect-search']?.value==='true'?'block':'none'},placeholder:config.txtSearch});
        listWrap.appendChild(search);
        div.appendChild(listWrap);
        listWrap.appendChild(list);

        el.loadOptions=()=>{
            list.innerHTML='';

            if(el.attributes['multiselect-select-all']?.value=='true'){
                var op=newEl('div',{class:'multiselect-dropdown-all-selector'})
                var ic=newEl('input',{type:'checkbox'});
                op.appendChild(ic);
                op.appendChild(newEl('label',{text:config.txtAll}));

                op.addEventListener('click',()=>{
                    op.classList.toggle('checked');
                    op.querySelector("input").checked=!op.querySelector("input").checked;

                    var ch=op.querySelector("input").checked;
                    list.querySelectorAll(":scope > div:not(.multiselect-dropdown-all-selector)")
                        .forEach(i=>{if(i.style.display!=='none'){i.querySelector("input").checked=ch; i.optEl.selected=ch}});

                    el.dispatchEvent(new Event('change'));
                });
                ic.addEventListener('click',(ev)=>{
                    ic.checked=!ic.checked;
                });
                el.addEventListener('change', (ev)=>{
                    let itms=Array.from(list.querySelectorAll(":scope > div:not(.multiselect-dropdown-all-selector)")).filter(e=>e.style.display!=='none')
                    let existsNotSelected=itms.find(i=>!i.querySelector("input").checked);
                    if(ic.checked && existsNotSelected) ic.checked=false;
                    else if(ic.checked==false && existsNotSelected===undefined) ic.checked=true;
                });

                list.appendChild(op);
            }

            Array.from(el.options).map(o=>{
                var op=newEl('div',{class:o.selected?'checked':'',optEl:o})
                var ic=newEl('input',{type:'checkbox',checked:o.selected});
                op.appendChild(ic);
                op.appendChild(newEl('label',{text:o.text}));

                op.addEventListener('click',()=>{
                    op.classList.toggle('checked');
                    op.querySelector("input").checked=!op.querySelector("input").checked;
                    op.optEl.selected=!!!op.optEl.selected;
                    el.dispatchEvent(new Event('change'));
                });
                ic.addEventListener('click',(ev)=>{
                    ic.checked=!ic.checked;
                });
                o.listitemEl=op;
                list.appendChild(op);
            });
            div.listEl=listWrap;

            div.refresh=()=>{
                div.querySelectorAll('span.optext, span.placeholder').forEach(t=>div.removeChild(t));
                var sels=Array.from(el.selectedOptions);
                if(sels.length>(el.attributes['multiselect-max-items']?.value??5)){
                    div.appendChild(newEl('span',{class:['optext','maxselected'],text:sels.length+' '+config.txtSelected}));
                }
                else{
                    sels.map(x=>{
                        var c=newEl('span',{class:'optext',text:x.text, srcOption: x});
                        if((el.attributes['multiselect-hide-x']?.value !== 'true'))
                            c.appendChild(newEl('span',{class:'optdel',text:'🗙',title:config.txtRemove, onclick:(ev)=>{c.srcOption.listitemEl.dispatchEvent(new Event('click'));div.refresh();ev.stopPropagation();}}));

                        div.appendChild(c);
                    });
                }
                if(0==el.selectedOptions.length) div.appendChild(newEl('span',{class:'placeholder',text:el.attributes['placeholder']?.value??config.placeholder}));
            };
            div.refresh();
        }
        el.loadOptions();

        search.addEventListener('input',()=>{
            list.querySelectorAll(":scope div:not(.multiselect-dropdown-all-selector)").forEach(d=>{
                var txt=d.querySelector("label").innerText.toUpperCase();
                d.style.display=txt.includes(search.value.toUpperCase())?'block':'none';
            });
        });

        div.addEventListener('click',()=>{
            div.listEl.style.display='block';
            search.focus();
            search.select();
        });

        document.addEventListener('click', function(event) {
            if (!div.contains(event.target)) {
                listWrap.style.display='none';
                div.refresh();
            }
        });
    });
}

document.querySelector('.insert_role').addEventListener('click',(e)=>{
    e.preventDefault()
    let name = document.querySelector("#name_role").value
    let permissions = document.querySelector("#field2").selectedOptions
    let idPermissions = []
    for (let i = 0; i < permissions.length; i++) {
        idPermissions.push(Number(permissions[i].value))
    }
    console.log(name, idPermissions)
    $.ajax({
        statusCode: {
            401: function() {
                swal("Bạn không có quyền thực hiện chức năng này.!", {});
            }
        },
        url: "/api/role?action=insert",
        method: "POST",
        data: {name, idPermissions : JSON.stringify(idPermissions)},
        success: res =>{
            let rs = JSON.parse(res)
            if(rs != 0){
                swal("Thêm nhóm quyền thành công.!", {});
                $('#myTable').DataTable().clear().destroy()
                getData()
            }else{
                swal("Thêm nhóm quyền không thành công.!", {});
            }
        },
        error: err=>{

        }
    })
})
