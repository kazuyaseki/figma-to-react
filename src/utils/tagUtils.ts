import { Tag } from '../core/buildTagTree'
import { IMAGE_TAG_PREFIX, IMAGE_TAG_SUFFIX, PRESSABLE_TAG_PREFIX, PRESSABLE_TAG_SUFFIX, TEXT_TAG_PREFIX, TEXT_TAG_SUFFIX } from './constants'

export function fixTagPrefixAndSuffix(tag: Tag, force = false) {
  if (tag.isImg || force) {
    if (tag.name.startsWith(IMAGE_TAG_PREFIX)) {
      tag.name = tag.name.substring(IMAGE_TAG_PREFIX.length, tag.name.length)
    }
    if (!tag.name.endsWith(IMAGE_TAG_SUFFIX)) {
      tag.name += IMAGE_TAG_SUFFIX
    }
  } else if (tag.isText || force) {
    if (tag.name.startsWith(TEXT_TAG_PREFIX)) {
      tag.name = tag.name.substring(TEXT_TAG_PREFIX.length, tag.name.length)
    }
    if (!tag.name.endsWith(TEXT_TAG_SUFFIX)) {
      tag.name += TEXT_TAG_SUFFIX
    }
  } else if (tag.name.startsWith(PRESSABLE_TAG_PREFIX)) {
    tag.name = tag.name.substring(PRESSABLE_TAG_PREFIX.length, tag.name.length)
    if (!tag.name.endsWith(PRESSABLE_TAG_SUFFIX)) {
      tag.name += PRESSABLE_TAG_SUFFIX
    }
  }
}

export function getTagNameWithoutPrefix(tagName: string) {
  if (tagName.startsWith(IMAGE_TAG_PREFIX)) {
    return tagName.substring(IMAGE_TAG_PREFIX.length, tagName.length)
  } else if (tagName.startsWith(TEXT_TAG_PREFIX)) {
    return tagName.substring(TEXT_TAG_PREFIX.length, tagName.length)
  } else if (tagName.startsWith(PRESSABLE_TAG_PREFIX)) {
    return tagName.substring(PRESSABLE_TAG_PREFIX.length, tagName.length)
  }
  return tagName
}
