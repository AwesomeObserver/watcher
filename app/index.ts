import { ServiceBroker } from 'moleculer';
import { Service, Event, BaseSchema } from 'moleculer-decorators';
import { createLogger } from 'bunyan';

export const logger = createLogger({
	name: 'rp-watcher'
});

export let broker = new ServiceBroker({
	transporter: process.env.NATS_URL,
	logger,
	logLevel: 'warn'
});

broker.start();

export const setupService = () => {
	@Service({
		name: 'watcher',
		dependencies: ['roomWaitlist', 'connection']
	})
	class WatcherService extends BaseSchema {
		started() {
			setInterval(() => {
				broker.call('roomWaitlist.watchTrackEnd').catch(() => {});
			}, 1000);

			setInterval(() => {
				broker.call('connection.checkInstanceAlive').catch(() => {});
			}, 5000);
		}
	}

	broker.createService(WatcherService);
};

setupService();
