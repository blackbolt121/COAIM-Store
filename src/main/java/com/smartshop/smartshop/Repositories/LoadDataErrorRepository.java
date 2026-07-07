package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.LoadDataError;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoadDataErrorRepository extends JpaRepository<LoadDataError, String> {
}
