import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { parse } from 'yaml'
import { describe, expect, test } from 'vitest'

const directory = join(import.meta.dirname, '../../src/content/docs/videos')
const files = readdirSync(directory).filter((file) => /\.mdx?$/.test(file))

function readFrontmatter(file: string) {
  const [, frontmatter] = readFileSync(join(directory, file), 'utf8').split('---')

  return parse(frontmatter ?? '') as {
    description?: string
    title?: string
    video?: { actions?: { link: string; text: string }[]; date?: string; duration?: number; link?: string; transcript?: string; type?: string }
  }
}

describe('video pages', () => {
  test('exist', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  test.each(files)('%s has a title, a description and a video', (file) => {
    const { description, title, video } = readFrontmatter(file)

    expect(title?.trim()).toBeTruthy()
    expect(description?.trim()).toBeTruthy()
    expect(video?.type).toBe('video')
  })

  test.each(files)('%s links to a YouTube video', (file) => {
    const { video } = readFrontmatter(file)

    expect(['www.youtube.com', 'youtube.com', 'youtu.be']).toContain(new URL(video?.link ?? '').hostname)
  })

  test.each(files)('%s has a positive duration and a date', (file) => {
    const { video } = readFrontmatter(file)

    expect(video?.duration).toBeGreaterThan(0)
    expect(String(video?.date)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  test.each(files)('%s links to https pages only', (file) => {
    for (const { link } of readFrontmatter(file).video?.actions ?? []) {
      expect(new URL(link).protocol).toBe('https:')
    }
  })

  test.each(files)('%s uses an existing transcript', (file) => {
    const { transcript } = readFrontmatter(file).video ?? {}

    if (transcript) {
      expect(() => readFileSync(join(import.meta.dirname, '../..', transcript), 'utf8')).not.toThrow()
    }
  })
})
