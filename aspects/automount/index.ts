import {command, handler, line, task} from 'fig';

task('configure /etc/auto_master', async () => {
    await line({
        notify: 'flush cache',
        path: '/etc/auto_master',
        regexp: /^\s*#?\s*\/net\s+/,
        sudo: true,
        line: '#/net\t\t\t-hosts\t\t-nobrowse,hidefromfinder,nosuid',
    });
});

handler('flush cache', async () => {
    await command('automount', ['-vc'], {sudo: true});
});
