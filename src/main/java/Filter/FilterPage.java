package Filter;


import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class FilterPage implements Filter {

    @Override
        public void init(FilterConfig filterConfig) throws ServletException {

        }

        @Override
        public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
            HttpServletRequest httpReq = (HttpServletRequest) servletRequest;
            HttpServletResponse httpResp = (HttpServletResponse) servletResponse;
            httpReq.getRequestDispatcher("/Page/404.jsp").forward(httpReq, httpResp);
    }

    @Override
    public void destroy() {

    }
}
