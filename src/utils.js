const formatUrl = (url) => {
  const urlObj = new URL(url);
  const { hostname, pathname } = urlObj;
  const stringifyedUrl = `${hostname}${pathname}`;
  const separators = new RegExp('\\W');
  const splitted = stringifyedUrl.split(separators);
  const joined = splitted.join('-');
  const formatted = `${joined}.html`;

  return formatted;
};

export default formatUrl;
