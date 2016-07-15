var restify = require('restify');
var Queue = require('./Queue');

var MobileEditorialTimelineGateway = function(){
	var timelinesViewStore = {};

	this.newTimeLine = function(newTimeLineEvent){
		eventPayload = newTimeLineEvent['payload'];
		timelinesViewStore[eventPayload['tv-content-id']] = mapToMobileTimeline(eventPayload);
		return this;
	};

	function mapToMobileTimeline(eventPayload){
		return {
			'm-start' : eventPayload['start'],
			'm-end' : eventPayload['end'],
			'm-experience' : eventPayload['experience']
		}
	}

	this.get = function(tvContentId) {
		if (!!timelinesViewStore[tvContentId]){
			return timelinesViewStore[tvContentId];
		}
		else {
			return {
				'm-experience' : 'NOTHING :('
			}
		}
	};	
};


var mobileEditorialTimeline = new MobileEditorialTimelineGateway();

Queue.subscribe('newTimeline', function(event){
	mobileEditorialTimeline.newTimeLine(event);
});

var server = restify.createServer();
server.use(restify.bodyParser({ mapParams: false }));

server.get('/mobiletimelines/:contentId', function(request, response){
	response.send(mobileEditorialTimeline.get(request.params.contentId));
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});