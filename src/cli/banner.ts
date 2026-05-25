/**
 * Prints a stylized ANSI color ASCII banner for the SMD CLI interface.
 */
export function printBanner(): void {
  const cyan = '\x1b[36m';
  const yellow = '\x1b[33m';
  const bold = '\x1b[1m';
  const gray = '\x1b[90m';
  const reset = '\x1b[0m';

  console.log(`${cyan}${bold}
  ███████╗███╗   ███╗██████╗ 
  ██╔════╝████╗ ████║██╔══██╗
  ███████╗██╔████╔██║██║  ██║
  ╚════██║██║╚██╔╝██║██║  ██║
  ███████║██║ ╚═╝ ██║██████╔╝
  ╚══════╝╚═╝     ╚═╝╚═════╝ 
  ${reset}${bold}System Manager Detector — SMD${yellow} v1.0.0${reset}
  ${gray}Auditing Linux Distros, Desktop Environments & Remote Services${reset}
  `);
}

export default printBanner;
