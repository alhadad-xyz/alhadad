/** @type {import('next').NextConfig} */
export default {
  // Static HTML in out/, served by Caddy next to paper.
  output: 'export',
  poweredByHeader: false,
  reactStrictMode: true,
  // Stops `next dev` writing AGENTS.md into site/; our notes live in docs/claude.md.
  agentRules: false,
};
