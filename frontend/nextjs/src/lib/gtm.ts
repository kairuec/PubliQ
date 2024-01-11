type WindowWithDataLayer = Window & {
  dataLayer: Record<string, any>[];
};

declare const window: WindowWithDataLayer;

export const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

export const pageview = (url: string) => {
  // if (process.env.NODE_ENV !== 'production') {
  //   return;
  // }
  if (typeof window.dataLayer !== 'undefined') {
    window.dataLayer.push({
      event: 'pageview',
      page: url,
    });
  } else {
    console.log({
      event: 'pageview',
      page: url,
    });
  }
};
