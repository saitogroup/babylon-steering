!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("babylonjs")):"function"==typeof define&&define.amd?define(["babylonjs"],t):e["babylon-steering"]=t(e.babylonjs)}(this,function(e){var t={avoid:10,queue:9,separation:7,flock:6,flee:6,seek:5,idle:0},i={avoid:.66,queue:.66,separation:.66,flock:.66,flee:.66,seek:.66,idle:.66},s=function(t,i,s){void 0===s&&(s={}),this.engine=i,this.mesh=t,this.mesh.checkCollisions=!0,this.steeringForce=new e.Vector3(0,0,0),this.maxForce=s.maxForce||1,this.velocity=new e.Vector3(0,0,0),this.forces=[],this.maxSpeed=s.maxSpeed||.2,this.mass=s.mass||1,this.velocitySamples=[],this.numSamplesForSmoothing=s.numSamplesForSmoothing||20,this.arrivalThreshold=s.arrivalThreshold||100,this.avoidDistance=s.avoidDistance||120,this.radius=s.radius||100,this.waypoints=[],this.pathIndex=0,this.wanderDistance=s.wanderDistance||10,this.wanderAngle=s.wanderAngle||10,this.wanderRadius=s.wanderRadius||5,this.wanderRange=s.wanderRange||20,this.inSightDistance=s.inSightDistance||200,this.tooCloseDistance=s.tooCloseDistance||60},o={dt:{configurable:!0}};return o.dt.get=function(){return this.engine.getDeltaTime()},o.dt.set=function(e){this.dt=e},s.prototype.idle=function(e,t){void 0===t&&(t={}),this.velocity.scaleInPlace(0),this.steeringForce.setAll(0,0,0),this.forces.push(Object.assign(t,{force:this.steeringForce,name:this.idle.name}))},s.prototype.lookTarget=function(e){return this.mesh.lookAt(e.mesh.position),this},s.prototype.lookWhereGoing=function(e){var t=this.mesh.position.clone().add(this.velocity);if(t.y=this.mesh.position.y,e){this.velocitySamples.length==this.numSamplesForSmoothing&&this.velocitySamples.shift();var i=this.velocity.clone();i.y=this.mesh.position.y,this.velocitySamples.push(i),t.setAll(0,0,0);for(var s=0;s<this.velocitySamples.length;s++)t.addInPlace(this.velocitySamples[s]);t.scaleInPlace(1/this.velocitySamples.length),(t=this.mesh.position.clone().add(t)).y=this.mesh.position.y}return this.mesh.lookAt(t),this},s.prototype.inSight=function(t){if(e.Vector3.Distance(this.mesh.position,t.mesh.position)>this.inSightDistance)return!1;var i=t.velocity.clone().normalize().scaleInPlace(1),s=t.mesh.position.clone().subtract(this.mesh.position.clone());return!(e.Vector3.Dot(s,i)<0)},s.prototype.hasInConeOfView=function(t){for(var i=0;i<t.length;i++){var s=t[i],o=s.mesh.position.clone(),n=this.mesh.position.clone(),h=e.Vector3.Distance(o,n),a=this.velocity.clone().normalize(),r=s.mesh.position.clone().subtract(this.mesh.position.clone());r.normalize();var c=e.Vector3.Dot(a,r),l=Math.acos(c),p=e.Tools.ToDegrees(l);s.mesh.material.emissiveColor=h<170&&p<60?new e.Color3(1,.5,0):s.mesh.color}return this},s.prototype.isInConeOfViewOf=function(t){var i=t.mesh.position.clone(),s=this.mesh.position.clone(),o=e.Vector3.Distance(i,s),n=t.velocity.clone().normalize(),h=this.mesh.position.clone().subtract(t.mesh.position.clone());h.normalize();var a=e.Vector3.Dot(n,h),r=Math.acos(a),c=e.Tools.ToDegrees(r);return this.mesh.material.emissiveColor=o<170&&c<60?new e.Color3(1,.5,0):new e.Color3(0,0,1),this},s.prototype.truncate=function(e,t){var i=t/e.length();return e.scaleInPlace(i<1?i:1)},s.prototype.update=function(){this.steeringForce=this.truncate(this.steeringForce,this.maxForce),this.steeringForce.scaleInPlace(1/this.mass),this.velocity.addInPlace(this.steeringForce),this.velocity=this.truncate(this.velocity,this.maxSpeed*this.dt),this.velocity.y=0,this.steeringForce.setAll(0,0,0),this.mesh.moveWithCollisions(this.velocity),this.forces=[]},s.prototype.applyForce=function(e,t){return void 0===t&&(t={}),this.forces.push(Object.assign(t,{force:e,name:this.applyForce.name})),this},s.prototype.attract=function(t,i,s,o){void 0===i&&(i=0),void 0===s&&(s=1),void 0===o&&(o={});var n=e.Vector3.Distance(this.mesh.position,t.mesh.position);if(n<i&&n>20){var h={force:this.mesh.position.clone().subtract(t.mesh.position.clone()).normalize().scaleInPlace(this.maxSpeed*this.dt*s).subtractInPlace(t.velocity),name:this.attract.name};t.forces.push(Object.assign(o,h))}else t.flee(this);return this},s.prototype.seek=function(t,i,s){if(void 0===i&&(i=0),void 0===s&&(s={}),e.Vector3.Distance(this.mesh.position,t.mesh.position)>i){var o={force:t.mesh.position.clone().subtract(this.mesh.position.clone()).normalize().scaleInPlace(this.maxSpeed*this.dt).subtractInPlace(this.velocity),name:this.seek.name};this.forces.push(Object.assign(s,o))}else this.idle(t,s);return this},s.prototype.seekWithArrive=function(t,i,s){void 0===s&&(s={});var o=t.mesh.position.clone().subtract(this.mesh.position.clone());o.normalize();var n=e.Vector3.Distance(t.mesh.position,this.mesh.position);n>this.arrivalThreshold?o.scaleInPlace(this.maxSpeed*this.dt):n>i&&n<this.arrivalThreshold?o.scaleInPlace(this.maxSpeed*this.dt*(n-i)/(this.arrivalThreshold-i)):this.idle(t,s);var h={force:o.subtractInPlace(this.velocity),name:this.seekWithArrive.name};return this.forces.push(Object.assign(s,h)),this},s.prototype.flee=function(t,i,s){if(void 0===i&&(i=0),void 0===s&&(s={}),e.Vector3.Distance(this.mesh.position,t.mesh.position)<i){var o={force:this.mesh.position.clone().subtract(t.mesh.position.clone()).normalize().scaleInPlace(this.maxSpeed*this.dt).subtractInPlace(this.velocity),name:this.flee.name};this.forces.push(Object.assign(s,o))}else this.idle(t,s);return this},s.prototype.arrive=function(t,i){void 0===i&&(i={});var s=t.mesh.position.clone().subtract(this.mesh.position.clone());s.normalize();var o=e.Vector3.Distance(t.mesh.position,this.mesh.position);s.scaleInPlace(o>this.arrivalThreshold?this.maxSpeed*this.dt:this.maxSpeed*this.dt*o/this.arrivalThreshold);var n={force:s.subtractInPlace(this.velocity),name:this.flee.name};return this.forces.push(Object.assign(i,n)),this},s.prototype.pursue=function(t,i){void 0===i&&(i=0);var s=e.Vector3.Distance(this.mesh.position,t.mesh.position)/(this.maxSpeed*this.dt),o=t.mesh.position.clone().add(t.velocity.clone().scaleInPlace(s));this.seek({mesh:{position:o}},i)},s.prototype.evade=function(t,i){void 0===i&&(i=0);var s=e.Vector3.Distance(this.mesh.position,t.mesh.position)/(this.maxSpeed*this.dt),o=t.mesh.position.clone().subtract(t.velocity.clone().scaleInPlace(s));this.flee({mesh:{position:o}},i)},s.prototype.canSee=function(t){var i=t.mesh.position.clone().subtract(this.mesh.position).normalize(),s=e.Vector3.Lerp(t.mesh.position.clone(),this.mesh.position.clone(),.66),o=new e.Ray(s,i,350),n=t.mesh.getScene().pickWithRay(o);return!(!n.pickedMesh||n.pickedMesh.uniqueId!==t.mesh.uniqueId)},s.prototype.hide=function(t,i,s){if(void 0===s&&(s=250),this.canSee(t)){this.lookTarget(t);for(var o=new e.Vector3(0,0,0),n=1e4,h=0;h<i.length;h++){var a=i[h],r=e.Vector3.Distance(this.mesh.position,a.mesh.position);r<n&&(o=a.mesh.position.clone(),n=r)}var c=e.Vector3.Distance(this.mesh.position,t.mesh.position),l=e.Vector3.Lerp(t.mesh.position.clone(),o.clone(),2);l.y=this.mesh.position.y,c<s?this.seek({mesh:{position:l}},10):this.flee(t)}else this.lookWhereGoing(!0),this.idle();return this},s.prototype.wander=function(t){void 0===t&&(t={});var i=this.velocity.clone().normalize().scaleInPlace(this.wanderDistance),s=new e.Vector3(1,1,1).scaleInPlace(this.wanderRadius);return s.x=Math.sin(this.wanderAngle)*s.length(),s.z=-Math.cos(this.wanderAngle)*s.length(),s.y=0,this.wanderAngle=Math.random()*this.wanderRange-.5*this.wanderRange,i.addInPlace(s),i.y=this.mesh.position.y,this.forces.push(Object.assign(t,{force:i,name:this.wander.name})),this},s.prototype.separation=function(t,i,s,o){void 0===i&&(i=50),void 0===s&&(s=40),void 0===o&&(o={});for(var n=new e.Vector3(0,0,0),h=0,a=0;a<t.length;a++)t[a]!=this&&e.Vector3.Distance(this.mesh.position,t[a].mesh.position)<=i&&(n.addInPlace(t[a].mesh.position.clone().subtractInPlace(this.mesh.position)),h++);return 0!=h&&(n.scaleInPlace(1/h),n.negateInPlace()),n.normalize().scaleInPlace(s),this.forces.push(Object.assign(o,{force:n,name:this.separation.name})),this},s.prototype.interpose=function(t,i){var s=t.mesh.position.clone().addInPlace(i.mesh.position.clone()).scaleInPlace(.5),o=e.Vector3.Distance(this.mesh.position,s)/(this.maxSpeed*this.dt),n=t.mesh.position.clone().addInPlace(t.velocity.clone().scaleInPlace(o)),h=i.mesh.position.clone().addInPlace(i.velocity.clone().scaleInPlace(o));s=n.addInPlace(h).scaleInPlace(.5),this.seek({mesh:{position:s}},10)},s.prototype.avoid=function(t,i){void 0===i&&(i={});for(var s=this.velocity.length()/(this.maxSpeed*this.dt),o=this.mesh.position.clone().addInPlace(this.velocity.clone().normalize().scaleInPlace(s)),n=this.mesh.position.clone().addInPlace(this.velocity.clone().normalize().scaleInPlace(.5*this.avoidDistance)),h=null,a=0;a<t.length;a++)t[a]!==this&&(e.Vector3.Distance(t[a].mesh.position,o)<=this.radius||e.Vector3.Distance(t[a].mesh.position,n)<=this.radius)&&(null==h||e.Vector3.Distance(this.mesh.position,t[a].mesh.position)<e.Vector3.Distance(this.mesh.position,h.mesh.position))&&(h=t[a]);var r=new e.Vector3(0,0,0);return null!=h?r=o.clone().subtractInPlace(h.mesh.position.clone()).normalize().scaleInPlace(this.maxSpeed*this.dt*.75):r.scaleInPlace(0),this.forces.push(Object.assign(i,{force:r,name:this.avoid.name})),this},s.prototype.followPath=function(t,i,s){void 0===s&&(s=10);var o=t[this.pathIndex];null!=o&&(e.Vector3.Distance(this.mesh.position,o)<s&&(this.pathIndex>=t.length-1?i&&(this.pathIndex=0):this.pathIndex++),this.pathIndex>=t.length-1&&!i?this.arrive({mesh:{position:o}}):this.seek({mesh:{position:o}}))},s.prototype.isOnLeaderSight=function(t,i,s){return e.Vector3.Distance(i,this.mesh.position)<=s||e.Vector3.Distance(t.mesh.position,this.mesh.position)<=s},s.prototype.followLeader=function(e,t,i,s,o,n,h){void 0===i&&(i=20),void 0===s&&(s=40),void 0===o&&(o=10),void 0===n&&(n=50),void 0===h&&(h=100);var a=e.velocity.clone();a.normalize().scaleInPlace(i);var r=e.mesh.position.clone().add(a);a.negateInPlace();var c=e.mesh.position.clone().add(a);return this.isOnLeaderSight(e,r,n)&&this.flee(e),this.arrivalThreshold=h,this.arrive({mesh:{position:c}}),this.separation(t,s,o),this},s.prototype.getNeighborAhead=function(t){for(var i,s=this.velocity.clone().normalize().scaleInPlace(100),o=this.mesh.position.clone().add(s),n=0;n<t.length;n++){var h=e.Vector3.Distance(o,t[n].mesh.position);if(t[n]!=this&&h<=100){i=t[n];break}}return i},s.prototype.queue=function(t,i,s){void 0===i&&(i=50),void 0===s&&(s={});var o=this.getNeighborAhead(t),n=new e.Vector3(0,0,0),h=this.velocity.clone();return null!=o&&(n=this.steeringForce.clone().negateInPlace().scaleInPlace(.8),h.negateInPlace().normalize(),n.add(h),e.Vector3.Distance(this.mesh.position,o.mesh.position)<=i&&this.velocity.scaleInPlace(.3)),this.forces.push(Object.assign(s,{force:n,name:this.queue.name})),this},s.prototype.flock=function(t,i){void 0===i&&(i={});for(var s=this.velocity.clone(),o=new e.Vector3(0,0,0),n=0,h=0;h<t.length;h++)t[h]!=this&&this.inSight(t[h])&&(s.add(t[h].velocity),o.add(t[h].mesh.position),e.Vector3.Distance(this.mesh.position,t[h].mesh.position)<this.tooCloseDistance&&this.flee(t[h]),n++);if(n>0){s.scaleInPlace(1/n),o.scaleInPlace(1/n),this.seek({mesh:{position:o}});var a={force:s.subtractInPlace(this.velocity),name:this.flock.name};this.forces.push(Object.assign(i,a))}return this},s.prototype.sortByPriority=function(e){return e.sort(function(e,i){return(i.priority||t[i.name])-(e.priority||t[e.name])})},s.prototype.animate=function(t){var s=this;if("blend"===t)this.forces.forEach(function(e){s.steeringForce=s.steeringForce.add(e.force).scaleInPlace(e.weigth||.5)});else if("priority"===t)this.forces=this.sortByPriority(this.forces),this.steeringForce=this.steeringForce.add(this.forces[0].force);else if("probability"===t){var o=new e.Vector3(0,0,0);this.forces=this.sortByPriority(this.forces);for(var n=0;n<this.forces.length;n++){var h=this.forces[n];if((h.probability||i[h.name])>Math.random()){o=h.force;break}}this.steeringForce=this.steeringForce.add(o)}else if("truncated"===t){this.forces=this.sortByPriority(this.forces);for(var a=0;a<this.forces.length;a++){var r=this.forces[a];if(this.steeringForce=this.steeringForce.add(r.force).scaleInPlace(r.weigth||.5),this.steeringForce.length()>.005)break}}else this.forces.forEach(function(e){s.steeringForce=s.steeringForce.add(e.force)});this.update()},Object.defineProperties(s.prototype,o),s});
//# sourceMappingURL=index.umd.js.map
