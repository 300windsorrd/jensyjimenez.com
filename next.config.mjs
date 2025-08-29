import withMDX from '@next/mdx';

const config = {
  experimental: {
    mdxRs: true,
  },
};

export default withMDX({})(config);
