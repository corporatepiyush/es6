const _ = require('date-fp')

const date = new Date('2015-01-01 01:01:01.000');


_.unixTime(new Date('2015-10-16T00:00:00+00:00'))  // 1444996800


_.equals(date, new Date('2015-04-09')); // true
_.equals(date, new Date('2014-01-01')); //false

_.add('milliseconds', 1, date); // 2015-01-01 01:01:01.1
_.add('seconds', 1, date); // 2015-01-01 01:01:02.0
_.add('minutes', 1, date); // 2015-01-01 01:02:01.0
_.add('hours', 1, date); // 2015-01-01 02:01:01.0
_.add('days', 1, date); // 2015-01-02 01:01:01.0
_.add('months', 1, date); // 2015-02-01 01:01:01.0
_.add('years', 1, date); // 2016-01-01 01:01:01.0


_.convertTo('milliseconds', date) // 1444953600000
_.convertTo('seconds', date) // 1444953600
_.convertTo('minutes', date) // 24082560
_.convertTo('hours', date) // 401376
_.convertTo('days', date) // 16724


const date1 = new Date('2014-02-01 11:12:13.123');
_.diff('milliseconds', date1, new Date('2014-02-01 11:12:13.223')); // 100
_.diff('seconds', date1, new Date('2014-02-01 11:12:16.123')); // 3
_.diff('minutes', date1, new Date('2014-02-01 11:8:13.123')); // -4
_.diff('hours', date1, new Date('2014-02-01 22:12:13.123')); // 11
_.diff('days', date1, new Date('2014-02-05 11:12:13.123')); // 4
_.diff('months', date1, new Date('2014-04-01 11:12:13.123')); // 2
_.diff('years', date1, new Date('2015-04-01 11:12:13.123')); // 1


_.parse('YYYY-MM-DD HH:mm:ss', '2015-01-01 12:13:14') // Thu Jan 01 2015 12:13:14 GMT+0000 (GMT)
_.parse('MMM Do, YYYY', 'January 1st, 2015') // Thu Jan 01 2015 00:00:00 GMT+0000 (GMT)


{
    const date1 = new Date('2015-01-01 11:22:33.333');
    const date2 = new Date('2014-04-09 01:22:33.333');
    const invalidDate = new Date('foo');

    _.max([date1, date2]); // date1
    _.max([date1, date2, invalidDate]); // date1
    _.max([invalidDate]); // Error
}
