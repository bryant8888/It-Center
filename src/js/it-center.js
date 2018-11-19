import jQuery from './jquery-slim.min'
import Hammer from './hammer'

jQuery(document).ready(function () {
    // clickable references
    let master1Ref = jQuery('#Master1Ref')
    let master2Ref = jQuery('#Master2Ref')
    let master3Ref = jQuery('#Master3Ref')

    // master info arrows
    let master1 = jQuery('#Master1')
    let master2 = jQuery('#Master2')
    let master3 = jQuery('#Master3')

    // master info blocks
    let master1Info = jQuery('#Master1Info')
    let master2Info = jQuery('#Master2Info')
    let master3Info = jQuery('#Master3Info')

    // encapsulate masters data in model
    let mastersList = [
        {
            masterRef: master1Ref,
            masterArrow: master1,
            masterInfo: master1Info
        },
        {
            masterRef: master2Ref,
            masterArrow: master2,
            masterInfo: master2Info
        },
        {
            masterRef: master3Ref,
            masterArrow: master3,
            masterInfo: master3Info
        }
    ]

    // Animate 'why-learn' block on hover to any element
    // DEPRECATED:
    // jQuery('.darken-photo')
    //     .on('mouseenter', function () {
    //         jQuery(this).find('.animated').removeClass('text-light').addClass('text-info')
    //     })
    //     .on('mouseleave', function () {
    //         jQuery(this).find('.animated').removeClass('text-info').addClass('text-light')
    //     })

    // toggled answer-question panels
    jQuery('.cursor-pointer').each(function () {
        let elem = jQuery(this)
        if (elem) {
            elem.click(function () {
                if (elem.hasClass('answered')) {
                    elem.removeClass('answered')
                } else {
                    elem.addClass('answered')
                }
            })
        }
    })

    jQuery('.open-program').click(function () {
        let elem = jQuery('#ProgramHidden')
        let message = jQuery('#ProgramMessage')
        if (elem.hasClass('opened')) {
            elem.removeClass('opened')
            message.text('Смотреть полностью программу курса')
        } else {
            elem.addClass('opened')
            message.text('Скрыть программу курса')
        }
    })

    // show/hidden block info about teachers
    for (let i = 0; i < mastersList.length; i++) {
        // wrapper for emulate 'let' variable in old browser
        (function (i) {
            let masterBlock = mastersList[i]
            let otherMasters = mastersList
                .filter(function (value) {
                    return value !== masterBlock
                })

            // add event listeners to every reference
            masterBlock.masterRef.click(function () {
                // show info about clicked master
                masterBlock.masterArrow.removeClass('hidden-block')
                masterBlock.masterInfo.removeClass('hidden-block')

                // hide others masters
                otherMasters.forEach(function (value) {
                    value.masterArrow.addClass('hidden-block')
                    value.masterInfo.addClass('hidden-block')
                })
            })
        })(i)
    }

    //    toggle header on scroll
    let stickHeader = jQuery('#StickHeader')

    jQuery(window).scroll(function (ev) {
        let userScrollingPosition = jQuery(this).scrollTop()
        let firstBlockHeight = jQuery('#Main').height()
        if (userScrollingPosition > firstBlockHeight) {
            stickHeader.addClass('showed')
        } else {
            stickHeader.removeClass('showed')
        }
    })

    jQuery("a.nav-link.scrollto, a.scrollto").on('click', function (event) {
        event.preventDefault();
        if (jQuery(jQuery.attr(this, 'href')).length) {
            jQuery('html, body').animate({
                scrollTop: jQuery(jQuery.attr(this, 'href')).offset().top - 100
            }, 500);
        } else {
            document.location = `${document.location.origin}/osnovi/${jQuery.attr(this, 'href')}`
        }
    });

    // jQuery("a.scrollto").click(function () {
    //     let elementClick = this.href;
    //     let destination = jQuery(elementClick).offset().top - 100;
    //     jQuery("html,body").animate({scrollTop: destination}, 1100);
    //     return false;
    // });

    //    activate dropdowns
    jQuery('.dropdown>a.nav-link').each(function () {
        jQuery(this).click();
    })

    let transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend'

    let Carousel = function (selector, callback) {
        if(jQuery('.pane-container').length) {
            let self = this
            let jQuerycarousel = jQuery(selector)
            let jQuerycontainer = jQuery('.pane-container', selector)
            let jQuerypanes = jQuery('.pane', selector)

            let paneWidth = 0
            let paneCount = jQuerypanes.length
            let panBoundary = 1 // if the pane is paned 1, switch to the next pane.

            let currentPane = 0

            callback(currentPane)

            function setPaneSize() {
                paneWidth = jQuerycarousel.width();
                jQuerypanes.each(function (i) {
                    jQuery(this).width(paneWidth)
                })
                jQuerycontainer.width(paneWidth * paneCount)
            }

            self.init = function () {
                setPaneSize();
                jQuery(window).on('load resize orientationchange', function () {
                    setPaneSize()
                    self.showPane(currentPane)
                })
            }

            self.showPane = function (index) {
                currentPane = Math.max(0, Math.min(index, paneCount - 1))
                setContainerOffsetX(-currentPane * paneWidth, true)
            }

            function setContainerOffsetX(offsetX, doTransition) {
                if (doTransition) {
                    jQuerycontainer
                        .addClass('transition')
                        .one(transitionEnd, function () {
                            jQuerycontainer.removeClass('transition')
                        })
                }
                jQuerycontainer.css({
                    left: offsetX
                });
            }

            self.next = function () {
                self.showPane(++currentPane)
                callback(currentPane)
            }
            self.prev = function () {
                self.showPane(--currentPane)
                callback(currentPane)
            }

            function handleHammer(e) {
                switch (e.type) {
                    case 'swipeleft':
                    case 'swiperight':
                        handleSwipe(e)
                        break
                    case 'panleft':
                    case 'panright':
                    case 'panend':
                    case 'pancancel':
                        handlePan(e)
                        break
                }
            }

            function handleSwipe(e) {
                switch (e.direction) {
                    case Hammer.DIRECTION_LEFT:
                        self.next()
                        break
                    case Hammer.DIRECTION_RIGHT:
                        self.prev()
                        break
                }
            }

            function outOfBound() {
                let left = jQuerycontainer.position().left
                return (currentPane == 0 && left >= 0) ||
                    (currentPane == paneCount - 1 && left <= -paneWidth * (paneCount - 1))
            }

            function handlePan(e) {
                switch (e.type) {
                    case 'panleft':
                    case 'panright':
                        // Slow down at the first and last pane.
                        if (outOfBound()) {
                            e.deltaX *= .2
                        }
                        setContainerOffsetX(-currentPane * paneWidth + e.deltaX)
                        break
                    case 'panend':
                    case 'pancancel':
                        if (Math.abs(e.deltaX) > paneWidth * panBoundary) {
                            if (e.deltaX > 0) {
                                self.prev()
                            } else {
                                self.next()
                            }
                        } else {
                            self.showPane(currentPane)
                        }
                        break
                }
            }

            let hammer = new Hammer(jQuerycarousel[0]).on(
                'swipeleft swiperight panleft panright panend pancancel',
                handleHammer
            )
        }

    }

    // synchronize markers colors with carousel items in Carousel callback
    let markers = [
        jQuery('#CarouselPointer1'),
        jQuery('#CarouselPointer2'),
        jQuery('#CarouselPointer3'),
        jQuery('#CarouselPointer4')
    ]

    let c = new Carousel('.carousel', function (number) {
        // compare numbers of carousel items and marker - if true - marker showed, others markers hides
        for (let i = 0; i < markers.length; i++) {
            (function (i) {
                if (i !== number) {
                    markers[i].find('.helper-marker').removeClass('showed')
                } else {
                    markers[i].find('.helper-marker').addClass('showed')
                }
            })(i)
        }


    })

    try {
        c.init()
        c.showPane(0)
    } catch (err) {

    }


    //toggle modal
    let isModalShowed = false;

    jQuery('.subscription-button, .hide-modal').click(function (event) {
        event.preventDefault();
        const courseName = jQuery(this).attr('data-course')
        if (isModalShowed) {
            isModalShowed = false
            jQuery('#Modal').removeClass('showed-modal')
        } else {
            isModalShowed = true
            jQuery('#Modal').addClass('showed-modal')
        }

        document.getElementById('CourseName').value = courseName

    })


    // // Появление модального окна через 10 секунд после открытия страницы
    // let self = this
    // setTimeout(function() {
    //     if(!isModalShowed && !localStorage.getItem('subscribeOnTryingLesson')) {
    //         isModalShowed = true
    //         jQuery('#TryingLessonModal').addClass('showed-modal')
    //     }
    // }, 30000)
    //
    // jQuery('#TryingLessonButton').click(function () {
    //     localStorage.setItem('subscribeOnTryingLesson', 1)
    // })
    //
    // jQuery('.hide-trying-modal').click(function (event) {
    //     if (isModalShowed) {
    //         isModalShowed = false
    //         jQuery('#TryingLessonModal').removeClass('showed-modal')
    //     } else {
    //         isModalShowed = true
    //         jQuery('#TryingLessonModal').addClass('showed-modal')
    //     }
    // })


    /*
    * Trying lesson submit cancel reference
    * */
    jQuery('input[type="submit"]').submit(function() {
        return false;
    })
})