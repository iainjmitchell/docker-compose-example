var amqp = require('amqplib');
var amqp_callback = require('amqplib/callback_api');
var when = require('when');

var QUEUE_ADDRESS = 'amqp://rabbit'

var Queue = function(){
	this.send = function(streamName, payload){
		amqp
			.connect(QUEUE_ADDRESS)
			.then(function(connection) {
		  		return when(
		  			connection.createChannel()
			  			.then(function(channel) {
						    var ok = channel.assertExchange(streamName, 'fanout', {durable: false});
				    		return ok.then(function(_qok) {
				    			var message = JSON.stringify(payload);
				      			channel.publish(streamName, '', new Buffer(message));
				      			console.log(" [x] Sent '%s'", message);
				      			return channel.close();
			    		});
			  		}))
		  			.ensure(function() { connection.close(); });
			})
			.then(null, console.warn);
	};

	this.subscribe = function(streamName, callback){
		amqp_callback.connect(QUEUE_ADDRESS, function(err, connection) {
			connection.createChannel(function(err, channel) {
		    	channel.assertExchange(streamName, 'fanout', {durable: false});
		    	channel.assertQueue('', {exclusive: true}, function(err, q) {
		    		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
		      		channel.bindQueue(q.queue, streamName, '');
		      		channel.consume(q.queue, function(message){
		      			var event = JSON.parse(message.content.toString());
		      			callback(event);
		      		}, {noAck: true});
		    });
		  });
		});
	};
};

module.exports = new Queue();



