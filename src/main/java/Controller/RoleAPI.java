package Controller;

import DAO.OderDAO;
import DAO.ProductDAO;
import DAO.RoleDAO;
import DTO.Orders;
import DTO.RoleDTO;
import Model.Oder;
import Model.OrderDetail;
import Model.Role;
import Security.Authorizeds;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;

@WebServlet("/api/role")
public class RoleAPI extends HttpServlet {
    @Override
    protected  void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        res.setContentType("text/html;charset=UTF-8");
        req.setCharacterEncoding("utf-8");
        try {
            ArrayList<RoleDTO> roles = (ArrayList<RoleDTO>) RoleDAO.getAllRole();
            res.getWriter().println(new Gson().toJson(roles));
            return;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        res.setContentType("text/html;charset=UTF-8");
        req.setCharacterEncoding("utf-8");
        String action = req.getParameter("action");
        if(action == null){
            res.setStatus(404);
            return;
        }
        switch (action){
            case "insert" :
                if(Authorizeds.authorizeds(req, Authorizeds.ROLE_INSERT))
                try {
                    roleInsert(req,res);
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
                else{
                    res.setStatus(401);
                }
                break;

            default:

        }
    }

    private void roleInsert(HttpServletRequest req, HttpServletResponse res) throws SQLException, IOException {
        String name = req.getParameter("name");
        int[] numbers = new Gson().fromJson(req.getParameter("idPermissions"), int[].class);
        if (numbers != null && numbers.length > 0) {
            int idRole = RoleDAO.insertRole(name);
           int add = RoleDAO.addRolePermission(numbers,idRole);
            res.getWriter().println(1);
            return;
        }
        res.getWriter().println(0);
    }

}