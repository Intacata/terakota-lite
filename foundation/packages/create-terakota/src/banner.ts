import chalk from 'chalk';
import type { FoundationConfig } from './types.js';

export const TERAKOTA_BANNER = `
${chalk.bold.hex('#1976D2')('  ████████╗███████╗██████╗  █████╗ ██╗  ██╗ ██████╗ ████████╗ █████╗ ')}
${chalk.bold.hex('#1565C0')('     ██╔══╝██╔════╝██╔══██╗██╔══██╗██║ ██╔╝██╔═══██╗╚══██╔══╝██╔══██╗')}
${chalk.bold.hex('#0D47A1')('     ██║   █████╗  ██████╔╝███████║█████╔╝ ██║   ██║   ██║   ███████║')}
${chalk.bold.hex('#1565C0')('     ██║   ██╔══╝  ██╔══██╗██╔══██║██╔═██╗ ██║   ██║   ██║   ██╔══██║')}
${chalk.bold.hex('#1976D2')('     ██║   ███████╗██║  ██║██║  ██║██║  ██╗╚██████╔╝   ██║   ██║  ██║')}
${chalk.dim('     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝')}

  ${chalk.bold.white('F O U N D A T I O N')}  ${chalk.dim('v1.1.0 — Multi-framework. Multi-variant. Instantly buildable.')}
  ${chalk.dim('─────────────────────────────────────────────────────────────────────────')}
`;

export const DONE_BANNER = (config: FoundationConfig) => {
    const { projectName, packageManager: pm, framework, desktop, frame, stateManager } = config;
    const devCmd = framework === 'cra' ? 'start' : 'dev';
    const electronNote = (desktop === 'electron' || desktop === 'electron-only')
        ? `\n    ${chalk.cyan(`${pm} run dev:electron`)}         ${chalk.dim('(desktop window)')}`
        : '';
    const installNote = !config.installDeps ? `\n    ${chalk.cyan(`${pm} install`)}` : '';

    return `
  ${chalk.bold.green('✔ Done!')} ${chalk.bold(projectName)} is ready.

  ${chalk.bold('Next steps:')}
${installNote}
    ${chalk.cyan(`cd ${projectName}`)}
    ${chalk.cyan(`${pm} run ${devCmd}`)}${electronNote}

  ${chalk.bold('What was created:')}
    ${chalk.dim('Framework')}     ${chalk.yellow(framework)}
    ${chalk.dim('Platform')}      ${chalk.yellow(desktop)}
    ${chalk.dim('Layout')}        ${chalk.yellow(frame)}
    ${chalk.dim('State')}         ${chalk.yellow(stateManager)}

  ${chalk.dim('Switch layouts at runtime:')}
    ${chalk.dim('dispatch(setLayoutVariant("sidebar-vertical"))')}

  ${chalk.dim('Docs:    ')} ${chalk.underline('https://foundation.terakota.live')}
  ${chalk.dim('Terakota:')} ${chalk.underline('https://terakota.live')}

  ${chalk.dim('Happy building! 🚀')}
`;
};
