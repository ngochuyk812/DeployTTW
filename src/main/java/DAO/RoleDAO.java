package DAO;

import Connect.ConnectDB;
import DTO.Permission;
import DTO.RoleDTO;
import Model.Role;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RoleDAO {
    public static List<RoleDTO> getAllRole() throws SQLException {
        List<RoleDTO> list=new ArrayList<>();
        Connection c = ConnectDB.getConnect();
        PreparedStatement stmt = c.prepareStatement("select * from role");
        ResultSet rs = stmt.executeQuery();
        while  (rs.next()) {
            RoleDTO role = getRoleDTO(rs.getInt(1));
            role.setName(rs.getString(2));
            list.add(role);
        }
        return list;
    }
    public static int insertRole(String name) throws SQLException {
        Connection c = ConnectDB.getConnect();
        PreparedStatement stmt = c.prepareStatement("insert into role (name) values(?) ", Statement.RETURN_GENERATED_KEYS);
        stmt.setString(1,name);
        int rs = stmt.executeUpdate();
        if (rs > 0) {
            ResultSet generatedKeys = stmt.getGeneratedKeys();
            if (generatedKeys.next()) {
                return generatedKeys.getInt(1);
            }
        }
        return -1;
    }
    public static Role getRole(int id) throws SQLException {
        Connection c = ConnectDB.getConnect();
        PreparedStatement stmt = c.prepareStatement("select * from role_permission where role_id = ?");
        stmt.setInt(1,id);
        ResultSet rs = stmt.executeQuery();
        Role role = new Role();
        while  (rs.next()) {
            role.setId(rs.getInt(1));

            role.addPermission(rs.getInt(2));
        }
        return role;
    }
    public static RoleDTO getRoleDTO(int id) throws SQLException {
        Connection c = ConnectDB.getConnect();
        PreparedStatement stmt = c.prepareStatement("select * from role_permission where role_id = ?");
        stmt.setInt(1,id);
        ResultSet rs = stmt.executeQuery();
        RoleDTO role = new RoleDTO();
        while  (rs.next()) {
            role.setId(rs.getInt(1));
            role.addPermission(getPermission(rs.getInt(2)));
        }
        return role;
    }
    public static ArrayList<Permission> getPermission() throws SQLException {
        Connection c = ConnectDB.getConnect();
        PreparedStatement stmt = c.prepareStatement("select * from permission");
        ResultSet rs = stmt.executeQuery();
        ArrayList<Permission> result = new ArrayList<Permission>();
        while  (rs.next()) {
            Permission permission = new Permission(rs.getInt(1), rs.getString(2));
            result.add(permission) ;
        }
        return result;
    }
    public static Permission getPermission(int id) throws SQLException {
        Connection c = ConnectDB.getConnect();
        PreparedStatement stmt = c.prepareStatement("select * from permission where id = ?");
        stmt.setInt(1,id);
        ResultSet rs = stmt.executeQuery();
        while  (rs.next()) {
            Permission permission = new Permission(rs.getInt(1), rs.getString(2));
            return permission;

        }
        return null;
    }
    public static int addRolePermission(int[] numbers, int id) throws SQLException {
        String sql = "insert into role_permission (role_id, permission_id) values";
        for (int tmp: numbers) {
            if(tmp == numbers[numbers.length - 1])
            sql+="(" + id+", "+tmp + ")";
            else
            sql+="(" + id+", "+tmp + "),";

        }
        Connection c = ConnectDB.getConnect();
        PreparedStatement stmt = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
        return  stmt.executeUpdate();
    }
    public static void main(String[] args) throws SQLException {
        int[] a = new int[3];
        a[0] = 15;
        a[1] = 17;
        a[2] = 16;
        System.out.println(RoleDAO.addRolePermission(a,7));
    }


}
