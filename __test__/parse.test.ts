import moment from 'moment';
import parse from '../src/parse';

it('timezone with zero', () => {
  const input = '2018-05-02 +0000';
  const format = 'YYYY-MM-DD ZZ';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('incorrect weekday', () => {
  const expected = new Date(NaN).valueOf();
  expect(parse('3 2019-10-1', 'd YYYY-MM-D').valueOf()).toEqual(expected);
  expect(parse('ww 2019-10-1', 'dd YYYY-MM-D').valueOf()).toEqual(expected);
  expect(parse('Mo 2019-10-1', 'dd YYYY-MM-D').valueOf()).toEqual(expected);

  expect(parse('www 2019-10-1', 'ddd YYYY-MM-D').valueOf()).toEqual(expected);
  expect(parse('Mon 2019-10-1', 'ddd YYYY-MM-D').valueOf()).toEqual(expected);

  expect(parse('www 2019-10-1', 'dddd YYYY-MM-D').valueOf()).toEqual(expected);
  expect(parse('Monday 2019-10-1', 'dddd YYYY-MM-D').valueOf()).toEqual(expected);
});

it('backupDate', () => {
  const input = '12:00';
  const format = 'HH:mm';
  const backupDate = new Date(2010, 3, 3, 5, 5, 5, 5);
  const expected = new Date(2010, 3, 3, 12, 0, 0, 0);
  expect(parse(input, format, { backupDate })).toEqual(expected);
});

it('backupDate when year is parsed', () => {
  const input = '2019 12:00';
  const format = 'YYYY HH:mm';
  const backupDate = new Date(2010, 3, 3, 5, 5, 5, 5);
  const expected = new Date(2019, 0, 1, 12, 0, 0, 0);
  expect(parse(input, format, { backupDate })).toEqual(expected);
});

it('return Invalid Date when parse corrupt short string', () => {
  const input = '2018 Dog 03';
  const format = 'YYYY MMM DD';
  expect(parse(input, format).valueOf()).toEqual(NaN);
});

it('Invalid Dates', () => {
  expect(parse('10/12/2014', 'YYYY-MM-DD').valueOf()).toEqual(NaN);
  expect(parse('10-12-2014', 'YYYY-MM-DD').valueOf()).toEqual(NaN);
  expect(parse('2014/10/12', 'YYYY-MM-DD').valueOf()).toEqual(NaN);
  expect(parse('2014/10/12', 'C').valueOf()).toEqual(NaN);
});

it('correctly parse string after changing locale globally', () => {
  const locale = {
    months: ['一月', '二月'],
    monthsShort: ['一', '二'],
  };
  expect(parse('2018年 二月 9号', 'YYYY年 MMMM D号', { locale })).toEqual(new Date(2018, 1, 9));
  expect(parse('2018 一 09', 'YYYY MMM DD', { locale })).toEqual(new Date(2018, 0, 9));
});

// it('correctly parse ordinal', () => {
//   const input = '7th March 2019';
//   const input2 = '17th March 2019';
//   const inputFalse = '7st March 2019';
//   const inputZHCN = '7日 三月 2019';
//   const format = 'Do MMMM YYYY';
//   expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
//   expect(parse(input2, format).valueOf()).toBe(moment(input2, format).valueOf());
//   expect(parse(inputFalse, format).valueOf()).toBe(moment(inputFalse, format).valueOf());
//   expect(parse(inputZHCN, format, 'zh-cn').valueOf()).toBe(moment(inputZHCN, format, 'zh-cn').valueOf());
// });