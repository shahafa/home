require('dotenv').config();

const CronJob = require('cron').CronJob;
const yad2Scan = require('./yad2Scanner');

if (process.argv[2]) {
  const hourInterval = process.argv[2];
  const cronTime = `0 */${hourInterval} * * *`;

  const yad2ScanJob = new CronJob({
    cronTime,
    onTick: yad2Scan,
    start: true,
  });
  yad2ScanJob.start();
} else {
  yad2Scan();
}
