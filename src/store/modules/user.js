export default {
    state: {
        perms: [],  // 用户权限标识集合
    },
    getters: {
   
    },
    mutations: {
        setPerms(state, perms){  // 用户权限标识集合
            for (var i = 0; i < perms.length; i++) {
                if (perms[i].children) {
                    for (var j = 0; j < perms[i].children.length; j++) {
                        if (perms[i].children[j].permissions) {
                            for (var k = 0; k < perms[i].children[j].permissions.length; k++) {
                                state.perms.push(perms[i].children[j].permissions[k].permission);
                            }                            
                        }
                    }
                }
            }        
        }
    },
    actions: {
    }
}