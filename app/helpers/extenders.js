define(['knockout'],
   function (knockout) {
       ko.extenders.dirty = function (target, isInitiallyDirty) {
           var state = ko.observable(serialize(target));

           target.isDirty = ko.computed(function () {
               return JSON.stringify(state()) != JSON.stringify(serialize(target));
           });

           target.isDirty.reset = function () {
               state(serialize(target));
           };

           function serialize(object) {
               return object && object() && object().serialize && typeof object().serialize == 'function'
                   ? object().serialize()
                   : ko.toJSON(object);
           }
       };

       ko.extenders.list = function (target) {
           target.empty = ko.pureComputed(function () {
               var array = target();
               return !Array.isArray(array) || array.length == 0;
           });
       };

       ko.extenders.serializable = function (target, serializable) {
           target.serializable = ko.observable(!!serializable);
           target.serialize = function () {
               var data = null;
               if (!!target.serializable) {
                   var inner = ko.toJS(target);
                   data = inner && typeof inner.serialize == 'function' ? inner.serialize() : inner;
               }
               return data;
           };
       };

       ko.extenders.active = function (target, callback) {
           var active = ko.observable(null);
           
           target.active = ko.computed({
               read: function () {
                   return active();
               }
           });
           target.activate = function (current) {
               if (target().indexOf(current) >= 0) {
                   if (typeof callback !== 'function') {
                       active(current);
                   } else if (active() !== current) {
                       $.when(callback.apply(null, arguments)).then(function (result) {
                           if (result) {
                               active(current);
                           }
                       });
                   }
               }
           };
           target.subscribe(function (array) {
               array.forEach(function (current) {
                   current.activeCallback = current.activeCallback || noop;
                   current.active = current.active || ko.pureComputed(function () {
                       return active() === current;
                   });
               });
           });

           init(target());
           target.notifySubscribers(target());

           function init(array) {
               var initial = array.find(function (current) {
                   return !!ko.utils.unwrapObservable(current.active);
               });
               array.forEach(function (current) {
                   delete current.active;
               });
               if (initial) {
                   active(initial);
               }
           }
       };
   });