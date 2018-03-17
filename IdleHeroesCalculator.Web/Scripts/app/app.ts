import * as ihc from './ihc'

declare var Vue: any;

var myvue = new Vue({
    el: "#test",
    data: { message: "HELLO" }
});

ihc.api("{factions{id,name,img},roles{id,name,img}}", true)
    .then(x => {
        if (x) {
            console.table(x.factions);
            console.table(x.roles);
            var v = new Vue({
                el: "#filters",
                data: x
            });
            console.log(v);
        }
    });