const linkParams = (
  customDomainSlug: string | undefined,
  category: WPCategory,
  subcategory: WPCategory | undefined = undefined
) => {
  if (subcategory) {
    return {
      categoryslug: category.slug,
      subcategoryslug_id: subcategory.slug,
      customdomainslug: customDomainSlug,
    }
  }

  return {
    categoryslug: category.slug,
    categoryslug_id: category.slug,
    customdomainslug: customDomainSlug,
  }
}

export default linkParams
