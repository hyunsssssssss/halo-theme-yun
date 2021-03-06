import "../sass/style.scss";
import yunCover from './index'
import loadPost from './post'
import { yunScrollTo, toTop } from './utils'


window['is_mobile'] = window.innerWidth <= 480;

window['toTop'] = toTop;
window['yunScrollTo'] = yunScrollTo;

toastr['options'] = {
    "positionClass": "toast-bottom-center",
    "timeOut": "1000"
}

class yunNav {
    constructor() {
        this.lastScroll = 0;
        this.container = $('.container');

        $(window).scroll(() => { this.onScroll(); });

        const navbar = $('.navbar-item');
        
        // 导航条移动端 toggle 点击事件
        $(".navbar-toggler").click((event)=>{
            const toggle = navbar.hasClass('active');

            if(toggle) {
                navbar.removeClass('active');
            } else {
                navbar.addClass('active');
            }

            this.toggleAnime(toggle);
            event.stopPropagation();
        });

        // 自动隐藏 导航条 侧边栏 主题钮
        $("body").click(()=>{
            let themeConfig = $('.theme-color-picker');
            if(navbar.hasClass('active')) navbar.removeClass('active');
            if(this.container.hasClass('sidebar')) this.container.removeClass('sidebar');
            if(themeConfig.hasClass('active')) themeConfig.removeClass('active');
        });
    }

    onScroll() {
        const top = $(window).scrollTop();
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

        if('is_post' in window) {
            let process = top / scrollHeight * 100;
            if(process>100)   process=100;
            $('.read-process').text(parseInt(process)+'%');
            $('.processbar-process').css('width', process+'%')
        }

        if(window._scrolling || top + 60 >= scrollHeight) {
            this.lastScroll = top;
            return;
        }

        if(top > this.lastScroll && ('is_post' in window) && !window.is_mobile && scrollHeight > 200 && 'auto_hide_nav' in window) {
            this.container.addClass('hide');
        } else {
            this.container.removeClass('hide');
        }

        this.lastScroll = top;
    }

    toggleAnime(toggle) {
        const tl = anime.timeline({easing: 'easeInOutQuad'});
    
        // navbar.attr('display', toggle?'none':'flex')
        tl.add({
            targets: '.navbar-item ul',
            opacity: toggle?[1, 0]:[0, 1],
            duration: 200
        }).add({
            targets: '.navbar-item li',
            delay: anime.stagger(100),
            translateX: toggle?undefined:[888, 0],
            duration: 300
        });
    }
}



// // load
document.addEventListener('DOMContentLoaded', ()=>{

    function setTheme(color) {
        function hexToRgb(hex) {
            var bigint = parseInt(hex, 16);
            var r = (bigint >> 16) & 255;
            var g = (bigint >> 8) & 255;
            var b = bigint & 255;
        
            return [r, g, b].join();
        }

        color = color.replace(/rgb\((.*)\)/,'$1').replace(/ /g,'');

        if(color.startsWith('#')) {
            color = hexToRgb(color.substring(1));
        }

        document.documentElement.style.setProperty('--theme-color', color);
        localStorage.setItem("themeColor", color);
    }

    new yunNav();

    $('.theme-config').click(function() {
        $('.float-bar').toggleClass('config');
    });

    $('.switch-theme-color').click(function(e) {
        $('.theme-color-picker').toggleClass('active');
        e.stopPropagation();
    });

    $('.color-wrapper input').click(function(e) {
        e.stopPropagation();
    }).on('input', function(e) {
        setTheme(e.target.value);
    });

    if('default_theme' in window) {
        $('.theme-color-picker .dot')[0].style['backgroundColor'] = default_theme;
    }
    
    $('.theme-color-picker .dot').click(function(e) {
        setTheme(e.target.style['backgroundColor']);
        toastr.success('主题色切换成功！');
    });

    $('.toggle-dark-mode').click(function(e) {
        if(document.documentElement.getAttribute('data-theme')=='dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem("nightMode", "false");
            toastr.success('已关闭夜间模式~');
        }
        else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem("nightMode", "true");
            toastr.success('已开启夜间模式~');
        }
    });

    if('is_index' in window) {
        new yunCover();
    }
    
    if('is_post' in window || 'is_sheet' in window) {
        loadPost();
    }
});