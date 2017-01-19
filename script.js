angular
.module("zoolandar", ["ngResource"])
.controller("ClassController", ["Class", ClassControllerFunc])
.factory("Class", ["$resource", ClassFactory])

function ClassControllerFunc(Class){
  let vm = this;
  Class.query( res => {
    vm.searchClasses = [];
    res.forEach( slot => {
      //copy array
      let newSlot = {};
      for (var k in slot) {
        newSlot[k] = slot[k];
      }
      newSlot.url="";
      if (newSlot.time != "End of File") {
        console.log(newSlot);
        vm.searchClasses.push(newSlot);
      }
    })
    vm.classes = res;
  });
  vm.getClasses = instructor =>  {vm.getLeads(instructor), vm.getSupports(instructor)}
  vm.getLeads = instructor => {
    instructor = instructor[0].toUpperCase() + instructor.toLowerCase().substr(1);
    vm.leads = vm.classes.filter( slot => slot.lead === instructor);
    return vm.leads;
  }
  vm.getSupports = instructor => {
    instructor = instructor[0].toUpperCase() + instructor.toLowerCase().substr(1);
    vm.supports = vm.classes.filter( slot => slot.support === instructor)
    return vm.supports;
  }
}

function ClassFactory($resource){
  return $resource("https://whenamion.herokuapp.com/schedule");
}
