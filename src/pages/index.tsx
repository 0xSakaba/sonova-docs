import type {ReactNode} from 'react';
import {Redirect} from '@docusaurus/router';

export default function Home(): ReactNode {
  // Redirect to docs intro page
  return <Redirect to="/docs/intro" />;
}
