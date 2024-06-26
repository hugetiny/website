import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import UAParser from 'ua-parser-js'
import Container from './Container'
import getConfig from 'next/config';

const HeroSection = ({ release }) => {
  const router = useRouter()
  //TODO Find a way to test github release file download speed is fast or not
  // const [githubIsFast, setGithubIsFast] = useState(true)
  const [downloadUrl, setDownloadUrl] = useState('https://github.com/GopeedLab/gopeed/releases/latest')
  const [cdnUrls, setCdnUrls] = useState([])

  useEffect(() => {
    const parser = new UAParser()
    const os = parser.getOS().name
    const ua = {
      arch: parser.getCPU().architecture,
    }
    if (os.includes('Windows')) {
      ua.os = 'windows'
    }
    if (os.includes('Mac')) {
      ua.os = 'macos'
    }
    if (os.includes('Linux')) {
      ua.os = 'linux'
    }
    if (os.includes('Android')) {
      ua.os = 'android'
    }
    if (os.includes('iOS')) {
      ua.os = 'ios'
    }

    const getDownloadCdnUrls = async (rawUrl) => {

      // if (!githubIsFast) {
      const { publicRuntimeConfig } = getConfig();
      const cdnUrls = publicRuntimeConfig.cdnUrls.split(',').map((url) => url + rawUrl.replace('https://github.com', ''));
      // const fastestUrl = await findFastestUrl(cdnUrls)
      return cdnUrls
      // } else {
      //   return [rawUrl]
      // }
    }

    const osAssert = release.assert[ua.os]
    // first match os and arch
    if (osAssert?.[ua.arch]) {
      getDownloadCdnUrls(osAssert[ua.arch]).then((urls) => {
        setCdnUrls(urls)
      }
      )
      return
    } else if (osAssert) {
      // second match os
      getDownloadCdnUrls(osAssert[Object.keys(osAssert)[0]]).then((urls) => {
        setCdnUrls(urls)
      })
      return
    }
  }, [release.assert])

  const { t } = useTranslation('common')
  return (
    <div className="relative" id="home">
      <div className="absolute inset-x-0 top-32 lg:hidden">
        <div aria-hidden="true" className="grid grid-cols-2 -space-x-52 opacity-50 dark:opacity-60 2xl:mx-auto 2xl:max-w-6xl">
          <div className="h-60 bg-gradient-to-br from-primary to-purple-400 blur-3xl dark:from-blue-700"></div>
          <div className="h-72 rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 blur-3xl dark:from-transparent dark:to-indigo-600"></div>
        </div>
      </div>
      <Container>
        <div className="relative pt-36 ml-auto">
          <div className="gap-12 md:flex md:items-center">
            <div className="text-center sm:px-12 md:w-2/3 md:px-0 md:text-left lg:w-1/2">
              <h1 className="text-3xl font-black dark:text-white lg:text-5xl">{t('home.title')}</h1>
              <div>
                <p className="mt-8 text-lg text-gray-700 dark:text-gray-100">{t('home.desc')}</p>
                <div className="mt-12 flex flex-col sm:flex-row sm:justify-center gap-4 sm:gap-6 md:justify-start" >
                  <Link
                    href={downloadUrl}
                    className="relative flex h-12 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-lg before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                  >
                    <span className="relative text-base font-semibold text-white normal-case">{t('download')}</span>
                  </Link>
                  {
                    cdnUrls.map((url, index) => (
                      <Link
                        key={index}
                        href={url}
                        className="relative flex h-12  items-center justify-center px-4 before:absolute before:inset-0 before:rounded-lg before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                      >
                        <span className="relative text-base font-semibold text-primary dark:text-white">{`${t('mirror') + (index + 1)}`}</span>
                      </Link>
                    ))
                  }
                              <Link
                    href="https://github.com/GopeedLab/gopeed/releases/latest"
                    className="relative flex h-12 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-lg before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                  >
                    <span className="relative text-base font-semibold text-primary dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">{t('otherOS')}</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative mt-20 md:mt-0 md:w-2/5 lg:w-3/5">
              <div className="md:-mr-72 lg:mr-0">
              <Image className="h-full object-cover" priority src="/images/ui.png" alt="screenshot" width="1628" height="1233" />
              </div>
            </div>
          </div>
          <div className="py-8 mt-16 border-y border-gray-100 dark:border-gray-800 sm:flex justify-between">
            <div className="text-left pb-4 lg:pb-0">
              <h6 className="text-lg font-semibold text-gray-700 dark:text-white">{t('home.feat1.title')}</h6>
              <p className="mt-2 text-gray-500">{t('home.feat1.desc')}</p>
            </div>
            <div className="text-left pb-4 lg:pb-0">
              <h6 className="text-lg font-semibold text-gray-700 dark:text-white">{t('home.feat2.title')}</h6>
              <p className="mt-2 text-gray-500">{t('home.feat2.desc')}</p>
            </div>
            <div className="text-left pb-4 lg:pb-0">
              <h6 className="text-lg font-semibold text-gray-700 dark:text-white">{t('home.feat3.title')}</h6>
              <p className="mt-2 text-gray-500">{t('home.feat3.desc')}</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default HeroSection
