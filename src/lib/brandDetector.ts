export interface BrandInfo {
  name: string;
  color: string;
}

export function getBrandMeta(url: string): BrandInfo {
  const cleanUrl = url.toLowerCase();

  if (cleanUrl.includes('instagram.com')) {
    return { name: 'Instagram', color: '#E4405F' };
  }
  if (cleanUrl.includes('medium.com')) {
    return { name: 'Medium', color: '#000000' };
  }
  if (cleanUrl.includes('gumroad.com')) {
    return { name: 'Gumroad', color: '#FF90E8' };
  }
  if (cleanUrl.includes('buymeacoffee.com')) {
    return { name: 'BuyMeACoffee', color: '#FFDD00' };
  }
  if (cleanUrl.includes('github.com')) {
    return { name: 'GitHub', color: '#181717' };
  }
  if (cleanUrl.includes('twitter.com') || cleanUrl.includes('x.com')) {
    return { name: 'X', color: '#000000' };
  }
  if (cleanUrl.includes('linkedin.com')) {
    return { name: 'LinkedIn', color: '#0A66C2' };
  }
  if (cleanUrl.includes('substack.com')) {
    return { name: 'Substack', color: '#FF6719' };
  }

  return { name: 'Website', color: '#6366F1' };
}