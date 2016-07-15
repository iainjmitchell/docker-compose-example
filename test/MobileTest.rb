require "bundler/setup"
require 'bunny'
require 'test/unit'
require 'json'
require 'rest-client'

HOST = 'http://mobilegateway:8080'

class MobileTests < Test::Unit::TestCase
	def test_m_start_is_returned
		start = Random.rand
		tv_content_id = "anId#{Random.rand}"
		event = {
			'payload' => {
				'tv-content-id' => tv_content_id,
				'start' => start,
				'end' => 12313,
				'experience' => 'bob'
			}
		}
		send_event(event)
		response = RestClient.get "#{HOST}/mobiletimelines/#{tv_content_id}"
		result = JSON.parse(response.body)
		assert_equal(start, result['m-start'])
	end

	def test_m_end_is_returned
		end_number = Random.rand
		tv_content_id = "anId#{Random.rand}"
		event = {
			'payload' => {
				'tv-content-id' => tv_content_id,
				'start' => 0,
				'end' => end_number,
				'experience' => 'bob'
			}
		}
		send_event(event)
		response = RestClient.get "#{HOST}/mobiletimelines/#{tv_content_id}"
		result = JSON.parse(response.body)
		assert_equal(end_number, result['m-end'])
	end

	def test_m_experience_is_returned
		experience = "exp#{Random.rand}"
		tv_content_id = "anId#{Random.rand}"
		event = {
			'payload' => {
				'tv-content-id' => tv_content_id,
				'start' => 0,
				'end' => 99,
				'experience' => experience
			}
		}
		send_event(event)
		response = RestClient.get "#{HOST}/mobiletimelines/#{tv_content_id}"
		result = JSON.parse(response.body)
		assert_equal(experience, result['m-experience'])
	end


	private
	def send_event(event)
		connection = Bunny.new('amqp://rabbit')
		connection.start
		channel = connection.create_channel
		exchange = channel.fanout("newTimeline")
		exchange.publish(event.to_json)
		connection.close
	end
end




