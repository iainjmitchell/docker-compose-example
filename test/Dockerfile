FROM ruby:2.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY Gemfile /usr/src/app/
COPY MobileTest.rb /usr/src/app/
RUN bundle install --path gems

COPY . /usr/src/app
CMD [ "ruby", "MobileTest.rb" ]