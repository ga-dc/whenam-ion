angular
.module("zoolandar", ["ngResource"])
.controller("ClassController", ["Class", ClassControllerFunc])
.factory("Class", ["$resource", ClassFactory])

function ClassControllerFunc(Class){
  this.classes = Class.query( res => {
    this.searchClasses = this.classes.map( slot => (delete slot.url) ? slot:slot);
  });
  this.getClasses = instructor =>  {this.getLeads(instructor), this.getSupports(instructor)}
  this.getLeads = instructor => {
    instructor = instructor[0].toUpperCase() + instructor.toLowerCase().substr(1);
    this.leads = this.classes.filter( slot => slot.lead === instructor);
    return this.leads;
  }
  this.getSupports = instructor => {
    instructor = instructor[0].toUpperCase() + instructor.toLowerCase().substr(1);
    this.supports = this.classes.filter( slot => slot.support === instructor)
    return this.supports;
  }
}

function ClassFactory($resource){
  return $resource("https://whenamion.herokuapp.com/schedule");
}
